import React, { useMemo, useEffect } from 'react';
import { ReactFlow, MiniMap, Controls, Background, useNodesState, useEdgesState } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

const CustomNode = ({ data }) => {
  const isGreen = data.hasEmployee;
  
  return (
    <div style={{
      padding: '10px 15px', 
      borderRadius: '8px',
      background: isGreen ? '#dcfce7' : '#ffffff',
      border: isGreen ? '2px solid #16a34a' : '2px solid #cbd5e1',
      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
      minWidth: '220px',
      textAlign: 'center',
      transition: 'all 0.3s ease'
    }}>
      <div style={{ 
        fontSize: '0.95rem', 
        fontWeight: 'bold', 
        color: isGreen ? '#14532d' : '#64748b', 
        marginBottom: '4px',
        fontStyle: isGreen ? 'normal' : 'italic'
      }}>
        {data.name}
      </div>
      <div style={{ 
        fontSize: '0.85rem', 
        color: '#0f172a', 
        background: isGreen ? '#bbf7d0' : '#f1f5f9', 
        padding: '4px', 
        borderRadius: '4px', 
        marginBottom: '4px',
        fontWeight: '600'
      }}>
        {data.title || 'Ünvan Yok'}
      </div>
      <div style={{ 
        fontSize: '0.75rem', 
        color: isGreen ? '#15803d' : '#64748b', 
        fontWeight: 'bold', 
        textTransform: 'uppercase' 
      }}>
        {data.department || ''}
      </div>
    </div>
  );
};

const nodeTypes = { custom: CustomNode };

export default function OrgChart({ titles = [], departments = [], employees = [] }) {
  // Veriyi Hiyerarşik Ağaç (Tree) ve Node/Edge'lere dönüştürme
  const { initialNodes, initialEdges } = useMemo(() => {
    const resultNodes = [];
    const resultEdges = [];

    // Map title by id
    const titleMap = {};
    titles.forEach(t => {
        titleMap[t.id] = { ...t, children: [] };
    });
    
    const roots = [];
    titles.forEach(t => {
        // Raporlayacağı ünvan var ve sistemde kayıtlı ise
        if (t.reportsToTitleId && titleMap[t.reportsToTitleId]) {
            titleMap[t.reportsToTitleId].children.push(titleMap[t.id]);
        } else {
            roots.push(titleMap[t.id]); // Kök ünvan (Genel Müdür, vb)
        }
    });

    const nodeWidth = 220;
    const verticalSpacing = 160;
    const horizontalSpacing = 40;

    // Her alt ağacın genişliğini hesapla
    function calculateWidths(node) {
        if (node.children.length === 0) {
            node.subtreeWidth = nodeWidth + horizontalSpacing;
        } else {
            node.subtreeWidth = 0;
            node.children.forEach(child => {
                calculateWidths(child);
                node.subtreeWidth += child.subtreeWidth;
            });
            node.subtreeWidth = Math.max(node.subtreeWidth, nodeWidth + horizontalSpacing);
        }
    }
    roots.forEach(calculateWidths);

    // Pozisyon atama
    function assignPositions(node, startX, depth) {
        node.x = startX + (node.subtreeWidth / 2) - (nodeWidth / 2);
        node.y = depth * verticalSpacing;
        
        const deptObj = departments.find(d => d.id === node.departmentId);
        const matchingEmps = employees.filter(e => e.titleId === node.id && e.isActive !== false);
        const hasEmployee = matchingEmps.length > 0;
        const employeeNames = hasEmployee ? matchingEmps.map(e => e.name).join(', ') : 'Boş Pozisyon';

        resultNodes.push({
            id: node.id,
            type: 'custom',
            position: { x: node.x, y: node.y },
            data: { 
              name: employeeNames, 
              title: node.name, 
              department: deptObj ? deptObj.name : 'Departmansız',
              hasEmployee
            },
        });

        let currentX = startX;
        node.children.forEach(child => {
            resultEdges.push({
                id: `e-${node.id}-${child.id}`,
                source: node.id,
                target: child.id,
                type: 'smoothstep',
                animated: true,
                style: { stroke: '#94a3b8', strokeWidth: 2 }
            });
            assignPositions(child, currentX, depth + 1);
            currentX += child.subtreeWidth;
        });
    }

    let initialX = 0;
    roots.forEach(r => {
        assignPositions(r, initialX, 0);
        initialX += r.subtreeWidth;
    });

    return { initialNodes: resultNodes, initialEdges: resultEdges };
  }, [titles, departments, employees]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Veri değiştiğinde Node ve Edge'leri yenile
  useEffect(() => {
    setNodes(initialNodes);
    setEdges(initialEdges);
  }, [initialNodes, initialEdges, setNodes, setEdges]);

  return (
    <div style={{ width: '100%', height: '600px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        fitView
        minZoom={0.2}
      >
        <MiniMap nodeStrokeWidth={3} zoomable pannable />
        <Controls />
        <Background color="#cbd5e1" gap={16} />
      </ReactFlow>
    </div>
  );
}
