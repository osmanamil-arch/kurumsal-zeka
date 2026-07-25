import React, { useState, useMemo } from 'react';
import './HumanResourcesModule.css'; // Mümkün mertebe mevcut stilleri kullan
import DepartmentAndTitleModule from './DepartmentAndTitleModule';
import { testCatalog } from '../data/testCatalog';

export default function MasterDataModule({ 
  departments, setDepartments,
  titles, setTitles,
  families, setFamilies, 
  functions, setFunctions, 
  levels, setLevels,
  respLib, setRespLib,
  taskLib, setTaskLib,
  compLib, setCompLib,
  skillLib, setSkillLib,
  knowLib, setKnowLib,
  certLib, setCertLib,
  userRole 
}) {
  // Sol menü navigasyonu
  const [activeCategory, setActiveCategory] = useState('jobFamilies');

  // Ortak Arama ve Filtreleme state'leri
  const [searchTerm, setSearchTerm] = useState('');
  const [filterActive, setFilterActive] = useState('all'); // 'all', 'active', 'passive'

  // Form (Ekleme / Düzenleme) state'leri
  const [editingItem, setEditingItem] = useState(null); // null veya { id, ... }
  const [formData, setFormData] = useState({});

  // AI Bulk Generator State
  const [aiBulkModal, setAiBulkModal] = useState({ isOpen: false, familyName: '', isLoading: false });

  const handleAIBulkLoad = () => {
    if (!aiBulkModal.familyName.trim()) return;
    setAiBulkModal(prev => ({ ...prev, isLoading: true }));
    
    setTimeout(() => {
       const fname = aiBulkModal.familyName;
       const newFamilyId = `fam_${Date.now()}`;
       
       // 1. İş Ailesini Ekle
       setFamilies(prev => [...prev, {
         id: newFamilyId,
         name: fname,
         description: 'AI tarafından otomatik üretildi',
         isActive: true,
         isPreloaded: false
       }]);

       // 2. Sorumlulukları Ekle
       const resps = [
         { id: `lib_r_custom_${Date.now()}_1`, title: `${fname} Stratejik Planlama`, description: 'Bölgesel ve kurumsal gelişim hedeflerini saptama.', jobFamilyId: newFamilyId, isActive: true },
         { id: `lib_r_custom_${Date.now()}_2`, title: `${fname} Operasyonel Mükemmellik`, description: 'Günlük ve haftalık iş akışını en verimli şekilde yönetme.', jobFamilyId: newFamilyId, isActive: true },
         { id: `lib_r_custom_${Date.now()}_3`, title: `${fname} Raporlama ve Analiz`, description: 'Temel veri analizlerini yaparak yönetime sunma.', jobFamilyId: newFamilyId, isActive: true },
       ];
       setRespLib(prev => [...prev, ...resps]);

       // 3. Görevleri (Tasks) Ekle
       const tasks = [];
       resps.forEach((r, i) => {
         tasks.push({ id: `t_${r.id}_1`, responsibilityId: r.id, title: `${fname} sektör trendlerini günlük olarak izlemek ve listelemek.`, criticality: 2, isActive: true });
         tasks.push({ id: `t_${r.id}_2`, responsibilityId: r.id, title: `Olası riskleri önceden tahmin edip aksiyon almak.`, criticality: 1, isActive: true });
         tasks.push({ id: `t_${r.id}_3`, responsibilityId: r.id, title: `Haftalık ${fname} departman toplantılarını asiste etmek.`, criticality: 3, isActive: true });
       });
       setTaskLib(prev => [...prev, ...tasks]);

       // 4. Yetkinlik ve Psikometri Bağlantıları Ekle
       const comps = [
         { id: `c_${Date.now()}_1`, title: `Analitik ve Sayısal Düşünme (${fname})`, familyId: newFamilyId, linkedTestId: 'sayisal_akil_yurutme', isActive: true },
         { id: `c_${Date.now()}_2`, title: `Duygusal Dayanıklılık ve Kriz Yönetimi`, familyId: newFamilyId, linkedTestId: 'duygusal_zeka', isActive: true },
         { id: `c_${Date.now()}_3`, title: `Sürekli Gelişim Odaklılık`, familyId: newFamilyId, linkedTestId: 'ogrenme_stili', isActive: true },
       ];
       setCompLib(prev => [...prev, ...comps]);

       // 5. Teknik Beceri ve Bilgi Alanları Ekle
       const skills = [
         { id: `s_${Date.now()}_1`, title: `${fname} Yazılımları İleri Düzey Kullanım`, familyId: newFamilyId, isActive: true },
         { id: `s_${Date.now()}_2`, title: `Büyük Veri Yönetimi Pratikleri`, familyId: newFamilyId, isActive: true }
       ];
       setSkillLib(prev => [...prev, ...skills]);

       setAiBulkModal({ isOpen: false, familyName: '', isLoading: false });
       alert(`✨ Büyü!</br> "${fname}" ailesi için sektör standartlarında Sorumluluklar, Görevler, Davranışsal Yetkinlikler (Mülakat & Test bağlantılı) ve Teknik Beceriler sisteme enjekte edildi!`);
    }, 1500);
  };

  // Context-Aware Mini Guide içerikleri
  const guideContents = {
    orgStructure: {
      title: "💡 Şirket İçi Organizasyon",
      text: "Departmanlar ve onlara bağlı ünvanların kurgulandığı alandır. Organizasyon Şeması, çalışan rehberindeki yönetici atamaları üzerinden otomatik şekillenir."
    },
    jobFamilies: {
      title: "💡 İş Aileleri Yönetimi",
      text: "İş Aileleri, yetkinlik kütüphanesi ve pozisyon gruplaması için en üst düzey şemsiye yapıdır. 'Satış', 'Finans' gibi temel alanları temsil eder. Yeni onay süreçlerini veya modülleri doğrudan etkilediğinden mevcut kayıtları 'Pasife Almak (Soft-delete)' önerilir."
    },
    jobFunctions: {
      title: "💡 İş Fonksiyonları",
      text: "Bir iş ailesinin altındaki uzmanlık kollarıdır. (Örn: Satış -> Saha Satış). Alt fonksiyonları pasife aldığınızda geçmiş formlar korunur ancak sihirbazdaki yeni seçimlerde görünmez."
    },
    jobLevels: {
      title: "💡 İş Seviyeleri (Job Levels)",
      text: "Organizasyonun derinliğini ifade eder. 'L1 - Giriş', 'L5 - Direktör' gibi. Sıralama Numarası (Level) sihirbazda kıdem veya liderlik yetkinliği önermek için kullanılır."
    },
    refCompetencies: {
      title: "💡 Yetkinlikler (Master Data)",
      text: "Sistemde var olan tüm temel yetkinlik isimleri ve genel tanımları burada yönetilir. Sihirbazda önermek için bunları 'Yetkinlik Önerileri' havuzuna bağlamanız gerekir."
    },
    libResponsibilities: {
      title: "💡 Sorumluluk Havuzu",
      text: "Sihirbazın 2. Adımında 'İş Ailesi' seçildiğinde çıkan hazır sorumluluklardır. Bir sorumluluğu Aileye, Fonksiyona veya Seviyeye bağlayarak anında önerilmesini sağlayın."
    },
    libTasks: {
      title: "💡 Görev Havuzu",
      text: "Sorumlulukların alt kırılımını ifade eden günlük rutin işlerdir. Form içerisinden Hangi Sorumluluğa ait olduğunu ve Kritikliğini belirleyebilirsiniz."
    },
    default: {
      title: "💡 Yönetim Rehberi",
      text: "Sol menüden referans verileri veya öneri havuzlarını seçerek yönetime başlayın. Eklediğiniz alanların anında sihirbaz ekranlarında güncellendiğini göreceksiniz."
    }
  };

  const activeGuide = guideContents[activeCategory] || guideContents.default;

  // -------------------------------------------------------------
  // İŞ AİLELERİ (JOB FAMILIES) CRUD İŞLEMLERİ
  // -------------------------------------------------------------
  const filteredFamilies = useMemo(() => {
    return families.filter(f => {
      const matchSearch = f.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchStatus = filterActive === 'all' 
                        ? true 
                        : (filterActive === 'active' ? f.isActive === true : f.isActive === false);
      return matchSearch && matchStatus;
    });
  }, [families, searchTerm, filterActive]);

  const handleEditFamily = (fam) => {
    setEditingItem(fam.id);
    setFormData({ name: fam.name, description: fam.description || '', isActive: fam.isActive });
  };

  const handleCancelEdit = () => {
    setEditingItem(null);
    setFormData({});
  };

  const handleSaveFamily = (e) => {
    e.preventDefault();
    if (editingItem === 'NEW') {
      const newFam = {
        id: `jf_custom_${Date.now()}`,
        name: formData.name,
        description: formData.description,
        isActive: formData.isActive !== undefined ? formData.isActive : true,
        isPreloaded: false // Sistem verisi değil, müşteri kendi yarattı
      };
      setFamilies([...families, newFam]);
    } else {
      setFamilies(prev => prev.map(f => f.id === editingItem ? { ...f, ...formData } : f));
    }
    handleCancelEdit();
  };

  const handleToggleActiveFamily = (id, currentStatus) => {
    setFamilies(prev => prev.map(f => f.id === id ? { ...f, isActive: !currentStatus } : f));
  };
  // -------------------------------------------------------------
  // İŞ FONKSİYONLARI (JOB FUNCTIONS) CRUD İŞLEMLERİ
  // -------------------------------------------------------------
  const filteredFunctions = useMemo(() => {
    return functions.filter(f => {
      const matchSearch = f.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchStatus = filterActive === 'all' 
                        ? true 
                        : (filterActive === 'active' ? f.isActive === true : f.isActive === false);
      return matchSearch && matchStatus;
    });
  }, [functions, searchTerm, filterActive]);

  const handleEditFunction = (func) => {
    setEditingItem(func.id);
    setFormData({ name: func.name, familyId: func.familyId, isActive: func.isActive });
  };

  const handleSaveFunction = (e) => {
    e.preventDefault();
    if (editingItem === 'NEW') {
      const newFunc = {
        id: `fn_custom_${Date.now()}`,
        name: formData.name,
        familyId: formData.familyId,
        isActive: formData.isActive !== undefined ? formData.isActive : true,
        isPreloaded: false
      };
      setFunctions([...functions, newFunc]);
    } else {
      setFunctions(prev => prev.map(f => f.id === editingItem ? { ...f, ...formData } : f));
    }
    handleCancelEdit();
  };

  const handleToggleActiveFunction = (id, currentStatus) => {
    setFunctions(prev => prev.map(f => f.id === id ? { ...f, isActive: !currentStatus } : f));
  };

  // -------------------------------------------------------------
  // İŞ SEVİYELERİ (JOB LEVELS) CRUD İŞLEMLERİ
  // -------------------------------------------------------------
  const filteredLevels = useMemo(() => {
    return levels.filter(l => {
      const matchSearch = l.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchStatus = filterActive === 'all' 
                        ? true 
                        : (filterActive === 'active' ? l.isActive === true : l.isActive === false);
      return matchSearch && matchStatus;
    }).sort((a,b) => a.level - b.level);
  }, [levels, searchTerm, filterActive]);

  const handleEditLevel = (lvl) => {
    setEditingItem(lvl.id);
    setFormData({ name: lvl.name, level: lvl.level, isActive: lvl.isActive });
  };

  const handleSaveLevel = (e) => {
    e.preventDefault();
    if (editingItem === 'NEW') {
      const newLvl = {
        id: `lvl_custom_${Date.now()}`,
        name: formData.name,
        level: Number(formData.level) || 1,
        isActive: formData.isActive !== undefined ? formData.isActive : true,
        isPreloaded: false
      };
      setLevels([...levels, newLvl]);
    } else {
      setLevels(prev => prev.map(l => l.id === editingItem ? { ...l, ...formData, level: Number(formData.level) } : l));
    }
    handleCancelEdit();
  };

  const handleToggleActiveLevel = (id, currentStatus) => {
    setLevels(prev => prev.map(l => l.id === id ? { ...l, isActive: !currentStatus } : l));
  };


  // -------------------------------------------------------------
  // SORUMLULUK HAVUZU (RESPONSIBILITIES) CRUD
  // -------------------------------------------------------------
  const filteredResponsibilities = useMemo(() => {
    return respLib.filter(r => {
      const matchSearch = r.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (r.description && r.description.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchStatus = filterActive === 'all' 
                        ? true 
                        : (filterActive === 'active' ? r.isActive === true : r.isActive === false);
      return matchSearch && matchStatus;
    });
  }, [respLib, searchTerm, filterActive]);

  const handleEditResp = (r) => {
    setEditingItem(r.id);
    setFormData({ title: r.title, description: r.description || '', jobFamilyId: r.jobFamilyId || '', isActive: r.isActive });
  };

  const handleSaveResp = (e) => {
    e.preventDefault();
    if (editingItem === 'NEW') {
      setRespLib([...respLib, {
        id: `lib_r_custom_${Date.now()}`,
        title: formData.title,
        description: formData.description,
        jobFamilyId: formData.jobFamilyId,
        isActive: formData.isActive !== undefined ? formData.isActive : true,
        isPreloaded: false
      }]);
    } else {
      setRespLib(prev => prev.map(r => r.id === editingItem ? { ...r, ...formData } : r));
    }
    handleCancelEdit();
  };

  const handleToggleActiveResp = (id, currentStatus) => {
    setRespLib(prev => prev.map(r => r.id === id ? { ...r, isActive: !currentStatus } : r));
  };


  // -------------------------------------------------------------
  // GÖREV HAVUZU (TASKS) CRUD
  // -------------------------------------------------------------
  const filteredTasks = useMemo(() => {
    return taskLib.filter(t => {
      const matchSearch = t.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchStatus = filterActive === 'all' 
                        ? true 
                        : (filterActive === 'active' ? t.isActive === true : t.isActive === false);
      return matchSearch && matchStatus;
    });
  }, [taskLib, searchTerm, filterActive]);

  const handleEditTask = (t) => {
    setEditingItem(t.id);
    setFormData({ title: t.title, responsibilityId: t.responsibilityId || '', criticality: t.criticality || 1, isActive: t.isActive });
  };

  const handleSaveTask = (e) => {
    e.preventDefault();
    if (editingItem === 'NEW') {
      setTaskLib([...taskLib, {
        id: `lib_t_custom_${Date.now()}`,
        title: formData.title,
        responsibilityId: formData.responsibilityId,
        criticality: Number(formData.criticality),
        isActive: formData.isActive !== undefined ? formData.isActive : true,
        isPreloaded: false
      }]);
    } else {
      setTaskLib(prev => prev.map(t => t.id === editingItem ? { ...t, ...formData, criticality: Number(formData.criticality) } : t));
    }
    handleCancelEdit();
  };

  const handleToggleActiveTask = (id, currentStatus) => {
    setTaskLib(prev => prev.map(t => t.id === id ? { ...t, isActive: !currentStatus } : t));
  };


  // -------------------------------------------------------------
  // YETKİNLİKLER, BECERİLER, BİLGİ VE SERTİFİKA (GENERIC CRUD)
  // -------------------------------------------------------------
  const getGenericState = () => {
    switch (activeCategory) {
      case 'refCompetencies': case 'libCompetencies': return { data: compLib, setter: setCompLib, label: 'Yetkinlik', idPrefix: 'c' };
      case 'refSkills': case 'libSkills': return { data: skillLib, setter: setSkillLib, label: 'Beceri', idPrefix: 's' };
      case 'refKnowledge': case 'libKnowledge': return { data: knowLib, setter: setKnowLib, label: 'Bilgi Alanı', idPrefix: 'k' };
      case 'refCertifications': case 'libCertifications': return { data: certLib, setter: setCertLib, label: 'Sertifika', idPrefix: 'cert' };
      default: return null;
    }
  };

  const genericCfg = getGenericState();

  const filteredGeneric = useMemo(() => {
    if (!genericCfg) return [];
    return genericCfg.data.filter(item => {
      const matchSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchStatus = filterActive === 'all' ? true : (filterActive === 'active' ? item.isActive === true : item.isActive === false);
      return matchSearch && matchStatus;
    });
  }, [activeCategory, compLib, skillLib, knowLib, certLib, searchTerm, filterActive]);

  const handleEditGeneric = (item) => {
    setEditingItem(item.id);
    setFormData({ title: item.title, familyId: item.familyId || '', isActive: item.isActive, linkedTestId: item.linkedTestId || '' });
  };

  const handleSaveGeneric = (e) => {
    e.preventDefault();
    if (!genericCfg) return;
    
    if (editingItem === 'NEW') {
      genericCfg.setter([...genericCfg.data, {
        id: `lib_${genericCfg.idPrefix}_custom_${Date.now()}`,
        title: formData.title,
        familyId: formData.familyId,
        isActive: formData.isActive !== undefined ? formData.isActive : true,
        linkedTestId: formData.linkedTestId || null,
        isPreloaded: false
      }]);
    } else {
      genericCfg.setter(prev => prev.map(item => item.id === editingItem ? { ...item, ...formData } : item));
    }
    handleCancelEdit();
  };

  const handleToggleActiveGeneric = (id, currentStatus) => {
    if (!genericCfg) return;
    genericCfg.setter(prev => prev.map(item => item.id === id ? { ...item, isActive: !currentStatus } : item));
  };


  return (
    <div className="mdm-container fade-in" style={{ display: 'flex', gap: '2rem', minHeight: '80vh' }}>
      
      {/* SOL MENÜ - Admin Layout */}
      <div className="mdm-sidebar glass" style={{ width: '250px', flexShrink: 0, padding: '1rem', borderRadius: '12px', overflowY: 'auto' }}>
        <h3 style={{ fontSize: '1rem', color: '#64748b', marginBottom: '1rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem' }}>Kurumsal Yapı</h3>
        <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 2rem 0' }}>
            <li style={{ marginBottom: '0.25rem' }}>
              <button 
                style={{ width: '100%', textAlign: 'left', padding: '0.6rem 0.75rem', background: activeCategory === 'orgStructure' ? '#e0e7ff' : 'transparent', color: activeCategory === 'orgStructure' ? '#3730a3' : '#475569', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: activeCategory === 'orgStructure' ? 600 : 400, fontSize: '0.85rem' }}
                onClick={() => { setActiveCategory('orgStructure'); handleCancelEdit(); }}
              >
                🏛️ Departman & Ünvanlar
              </button>
            </li>
        </ul>

        <h3 style={{ fontSize: '1rem', color: '#64748b', marginBottom: '1rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem' }}>İK Referans Verileri</h3>
        <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 2rem 0' }}>
          {['jobFamilies', 'jobFunctions', 'jobLevels', 'refCompetencies', 'refSkills', 'refKnowledge', 'refCertifications'].map(key => {
            const labels = {
              jobFamilies: '🏢 İş Aileleri',
              jobFunctions: '⚙️ İş Fonksiyonları',
              jobLevels: '📈 İş Seviyeleri',
              refCompetencies: '🎯 Yetkinlikler (Master)',
              refSkills: '🔧 Beceriler (Master)',
              refKnowledge: '🧠 Bilgi Alanları (Master)',
              refCertifications: '📜 Sertifikalar (Master)'
            };
            return (
              <li key={key} style={{ marginBottom: '0.25rem' }}>
                <button 
                  style={{ width: '100%', textAlign: 'left', padding: '0.6rem 0.75rem', background: activeCategory === key ? '#e0e7ff' : 'transparent', color: activeCategory === key ? '#3730a3' : '#475569', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: activeCategory === key ? 600 : 400, fontSize: '0.85rem' }}
                  onClick={() => { setActiveCategory(key); handleCancelEdit(); }}
                >
                  {labels[key]}
                </button>
              </li>
            );
          })}
        </ul>

        <h3 style={{ fontSize: '1rem', color: '#64748b', marginBottom: '1rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem' }}>Öneri Kütüphaneleri</h3>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {['libResponsibilities', 'libTasks', 'libCompetencies', 'libSkills', 'libKnowledge', 'libCertifications'].map(key => {
            const labels = {
              libResponsibilities: '📋 Sorumluluk Havuzu',
              libTasks: '✅ Görev Havuzu',
              libCompetencies: '🎯 Yetkinlik Önerileri',
              libSkills: '🔧 Beceri Önerileri',
              libKnowledge: '🧠 Bilgi Önerileri',
              libCertifications: '📜 Sertifika Önerileri'
            };
            return (
               <li key={key} style={{ marginBottom: '0.25rem' }}>
                <button 
                  style={{ width: '100%', textAlign: 'left', padding: '0.6rem 0.75rem', background: activeCategory === key ? '#eff6ff' : 'transparent', color: activeCategory === key ? '#1d4ed8' : '#64748b', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: activeCategory === key ? 600 : 400, fontSize: '0.85rem' }}
                  onClick={() => { setActiveCategory(key); handleCancelEdit(); }}
                >
                  {labels[key]}
                </button>
              </li>
            )
          })}
        </ul>
      </div>

      {/* ORTA ALAN - İşlem Paneli & CRUD */}
      <div className="mdm-content glass" style={{ flex: 1, padding: '2rem', borderRadius: '12px', display: 'flex', flexDirection: 'column' }}>
        
        {/* Üst Toolbar: Arama ve Filtre */}
        {activeCategory !== 'orgStructure' && (
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', alignItems: 'center' }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <span style={{ position: 'absolute', left: '10px', top: '10px', color: '#94a3b8' }}>🔍</span>
            <input 
              type="text" 
              placeholder="Listede Ara..." 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ padding: '0.6rem 0.6rem 0.6rem 2.2rem', width: '100%', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none' }}
            />
          </div>
          <select 
            value={filterActive} 
            onChange={(e) => setFilterActive(e.target.value)}
            style={{ padding: '0.6rem', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none', minWidth: '150px' }}
          >
            <option value="all">Tümü (Aktif + Pasif)</option>
            <option value="active">Sadece Aktifler</option>
            <option value="passive">Sadece Pasifler</option>
          </select>
          <button 
            onClick={() => { setEditingItem('NEW'); setFormData({ name: '', description: '', isActive: true }); }}
            style={{ padding: '0.6rem 1.2rem', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 600, cursor: 'pointer' }}
          >
            + Yeni Ekle
          </button>
          
          <button 
            onClick={() => setAiBulkModal({ isOpen: true, familyName: '', isLoading: false })}
            style={{ padding: '0.6rem 1.2rem', background: 'linear-gradient(135deg, #8b5cf6, #4f46e5)', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', boxShadow: '0 4px 6px -1px rgba(99,102,241,0.3)', transition: 'all 0.2s', outline: 'none' }}
          >
            ✨ AI Otonom Doldur
          </button>
        </div>
        )}

        {/* Tablo veya Form Alanı */}
        <div style={{ flex: 1 }}>
          
          {/* ŞİRKET İÇİ ORGANİZASYON GÖRÜNÜMÜ */}
          {activeCategory === 'orgStructure' && (
            <div className="fade-in">
               <DepartmentAndTitleModule departments={departments} setDepartments={setDepartments} titles={titles} setTitles={setTitles} />
            </div>
          )}

          {/* İŞ AİLELERİ (JOB FAMILIES) GÖRÜNÜMÜ */}
          {activeCategory === 'jobFamilies' && (
            <>
              {editingItem ? (
                <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '1.5rem', marginBottom: '1.5rem' }}>
                  <h4 style={{ margin: '0 0 1rem 0' }}>{editingItem === 'NEW' ? 'Yeni İş Ailesi Ekle' : 'İş Ailesi Düzenle'}</h4>
                  <form onSubmit={handleSaveFamily} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.25rem' }}>Aile Adı (Title)</label>
                      <input type="text" value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} required style={{ width: '100%', padding: '0.6rem', borderRadius: '4px', border: '1px solid #cbd5e1' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.25rem' }}>Açıklama (Description)</label>
                      <input type="text" value={formData.description || ''} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Bu aile hangi rolleri kapsar?" style={{ width: '100%', padding: '0.6rem', borderRadius: '4px', border: '1px solid #cbd5e1' }} />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#fffbeb', padding: '0.5rem', borderRadius: '4px', border: '1px solid #fde68a' }}>
                      <input type="checkbox" id="isActiveCheck" checked={formData.isActive} onChange={e => setFormData({...formData, isActive: e.target.checked})} />
                      <div>
                        <label htmlFor="isActiveCheck" style={{ fontSize: '0.85rem', fontWeight: 600, color: '#92400e' }}>Aktif (Sihirbazda Seçilebilir)</label>
                        <div style={{ fontSize: '0.7rem', color: '#b45309', marginTop: '2px' }}>🔒 Pasife alsanız dahi geçmiş analiz formları bozulmaz, yalnızca yeni seçim işlemlerinden gizlenir.</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                      <button type="submit" style={{ padding: '0.6rem 1.2rem', background: '#10b981', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 500 }}>Kaydet</button>
                      <button type="button" onClick={handleCancelEdit} style={{ padding: '0.6rem 1.2rem', background: '#ef4444', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 500 }}>İptal</button>
                    </div>
                  </form>
                </div>
              ) : (
                <div style={{ background: 'white', borderRadius: '8px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                   <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                      <thead>
                        <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                          <th style={{ padding: '1rem', width: '40%' }}>İş Ailesi</th>
                          <th style={{ padding: '1rem', width: '25%' }}>Durum</th>
                          <th style={{ padding: '1rem', width: '15%' }}>Tür</th>
                          <th style={{ padding: '1rem', width: '10%', textAlign: 'right' }}>Aksiyonlar</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredFamilies.map((fam) => (
                           <tr key={fam.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                             <td style={{ padding: '1rem' }}>
                               <div style={{ fontWeight: 600, color: '#1e293b' }}>{fam.name}</div>
                               {fam.description && <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px' }}>{fam.description}</div>}
                             </td>
                             <td style={{ padding: '1rem' }}>
                               {fam.isActive 
                                  ? <span style={{ background: '#dcfce7', color: '#166534', padding: '2px 8px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 600 }}>Aktif</span>
                                  : <span style={{ background: '#fee2e2', color: '#991b1b', padding: '2px 8px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 600 }}>Pasif</span>
                               }
                             </td>
                             <td style={{ padding: '1rem' }}>
                               {fam.isPreloaded 
                                  ? <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Sistem M.D</span>
                                  : <span style={{ fontSize: '0.75rem', color: '#3b82f6' }}>Şirket Verisi</span>
                               }
                             </td>
                             <td style={{ padding: '1rem', textAlign: 'right', display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                                <button onClick={() => handleEditFamily(fam)} style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '4px 8px', cursor: 'pointer', color: '#334155' }}>✏️ Düzenle</button>
                                <button onClick={() => handleToggleActiveFamily(fam.id, fam.isActive)} style={{ background: fam.isActive ? '#fff1f2' : '#f0fdf4', border: `1px solid ${fam.isActive ? '#fecdd3' : '#bbf7d0'}`, borderRadius: '4px', padding: '4px 8px', cursor: 'pointer', color: fam.isActive ? '#e11d48' : '#16a34a' }}>
                                  {fam.isActive ? 'Pasife Al' : 'Aktif Et'}
                                </button>
                             </td>
                           </tr>
                        ))}
                        {filteredFamilies.length === 0 && (
                          <tr><td colSpan="4" style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>Sonuç bulunamadı.</td></tr>
                        )}
                      </tbody>
                   </table>
                </div>
              )}
            </>
          )}

          {/* İŞ FONKSİYONLARI GÖRÜNÜMÜ */}
          {activeCategory === 'jobFunctions' && (
            <>
              {editingItem ? (
                <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '1.5rem', marginBottom: '1.5rem' }}>
                  <h4 style={{ margin: '0 0 1rem 0' }}>{editingItem === 'NEW' ? 'Yeni İş Fonksiyonu Ekle' : 'İş Fonksiyonu Düzenle'}</h4>
                  <form onSubmit={handleSaveFunction} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.25rem' }}>Bağlı İş Ailesi</label>
                      <select value={formData.familyId || ''} onChange={e => setFormData({...formData, familyId: e.target.value})} required style={{ width: '100%', padding: '0.6rem', borderRadius: '4px', border: '1px solid #cbd5e1' }}>
                        <option value="">-- Aile Seçin --</option>
                        {families.map(f => (
                          <option key={f.id} value={f.id}>{f.name} {f.isActive ? '' : '(Pasif)'}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.25rem' }}>Fonksiyon Adı (Title)</label>
                      <input type="text" value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} required placeholder="Örn: B2B Satış" style={{ width: '100%', padding: '0.6rem', borderRadius: '4px', border: '1px solid #cbd5e1' }} />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#fffbeb', padding: '0.5rem', borderRadius: '4px', border: '1px solid #fde68a' }}>
                      <input type="checkbox" id="isActiveCheckFunc" checked={formData.isActive} onChange={e => setFormData({...formData, isActive: e.target.checked})} />
                      <div>
                        <label htmlFor="isActiveCheckFunc" style={{ fontSize: '0.85rem', fontWeight: 600, color: '#92400e' }}>Aktif (Sihirbazda Seçilebilir)</label>
                        <div style={{ fontSize: '0.7rem', color: '#b45309', marginTop: '2px' }}>🔒 Pasife asanız dahi geçmiş form kayıtları bozulmaz, yalnızca yeni seçim işlemlerinden gizlenir.</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                      <button type="submit" style={{ padding: '0.6rem 1.2rem', background: '#10b981', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 500 }}>Kaydet</button>
                      <button type="button" onClick={handleCancelEdit} style={{ padding: '0.6rem 1.2rem', background: '#ef4444', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 500 }}>İptal</button>
                    </div>
                  </form>
                </div>
              ) : (
                <div style={{ background: 'white', borderRadius: '8px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                   <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                      <thead>
                        <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                          <th style={{ padding: '1rem', width: '35%' }}>İş Fonksiyonu</th>
                          <th style={{ padding: '1rem', width: '25%' }}>Bağlı İş Ailesi</th>
                          <th style={{ padding: '1rem', width: '15%' }}>Durum</th>
                          <th style={{ padding: '1rem', width: '25%', textAlign: 'right' }}>Aksiyonlar</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredFunctions.map((func) => {
                           const parentFam = families.find(f => f.id === func.familyId);
                           return (
                           <tr key={func.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                             <td style={{ padding: '1rem', fontWeight: 600, color: '#1e293b' }}>{func.name}</td>
                             <td style={{ padding: '1rem', color: '#64748b' }}>{parentFam ? parentFam.name : '-'}</td>
                             <td style={{ padding: '1rem' }}>
                               {func.isActive 
                                  ? <span style={{ background: '#dcfce7', color: '#166534', padding: '2px 8px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 600 }}>Aktif</span>
                                  : <span style={{ background: '#fee2e2', color: '#991b1b', padding: '2px 8px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 600 }}>Pasif</span>
                               }
                             </td>
                             <td style={{ padding: '1rem', textAlign: 'right', display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                                <button onClick={() => handleEditFunction(func)} style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '4px 8px', cursor: 'pointer', color: '#334155' }}>✏️ Düzenle</button>
                                <button onClick={() => handleToggleActiveFunction(func.id, func.isActive)} style={{ background: func.isActive ? '#fff1f2' : '#f0fdf4', border: `1px solid ${func.isActive ? '#fecdd3' : '#bbf7d0'}`, borderRadius: '4px', padding: '4px 8px', cursor: 'pointer', color: func.isActive ? '#e11d48' : '#16a34a' }}>
                                  {func.isActive ? 'Pasife Al' : 'Aktif Et'}
                                </button>
                             </td>
                           </tr>
                         )})}
                        {filteredFunctions.length === 0 && (
                          <tr><td colSpan="4" style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>Sonuç bulunamadı.</td></tr>
                        )}
                      </tbody>
                   </table>
                </div>
              )}
            </>
          )}

          {/* İŞ SEVİYELERİ GÖRÜNÜMÜ */}
          {activeCategory === 'jobLevels' && (
            <>
              {editingItem ? (
                <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '1.5rem', marginBottom: '1.5rem' }}>
                  <h4 style={{ margin: '0 0 1rem 0' }}>{editingItem === 'NEW' ? 'Yeni Seviye Ekle' : 'Seviye Düzenle'}</h4>
                  <form onSubmit={handleSaveLevel} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.25rem' }}>Seviye Adı (Title)</label>
                      <input type="text" value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} required placeholder="Örn: L6 - C-Level" style={{ width: '100%', padding: '0.6rem', borderRadius: '4px', border: '1px solid #cbd5e1' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.25rem' }}>Sıralama Numarası (Kıdem)</label>
                      <input type="number" min="1" max="10" value={formData.level || 1} onChange={e => setFormData({...formData, level: e.target.value})} required style={{ width: '100px', padding: '0.6rem', borderRadius: '4px', border: '1px solid #cbd5e1' }} />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#fffbeb', padding: '0.5rem', borderRadius: '4px', border: '1px solid #fde68a' }}>
                      <input type="checkbox" id="isActiveCheckLvl" checked={formData.isActive} onChange={e => setFormData({...formData, isActive: e.target.checked})} />
                      <div>
                        <label htmlFor="isActiveCheckLvl" style={{ fontSize: '0.85rem', fontWeight: 600, color: '#92400e' }}>Aktif (Sihirbazda Seçilebilir)</label>
                        <div style={{ fontSize: '0.7rem', color: '#b45309', marginTop: '2px' }}>🔒 Pasife asanız dahi geçmiş analiz formları bozulmaz, yalnızca yeni seçimlerde gizlenir.</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                      <button type="submit" style={{ padding: '0.6rem 1.2rem', background: '#10b981', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 500 }}>Kaydet</button>
                      <button type="button" onClick={handleCancelEdit} style={{ padding: '0.6rem 1.2rem', background: '#ef4444', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 500 }}>İptal</button>
                    </div>
                  </form>
                </div>
              ) : (
                <div style={{ background: 'white', borderRadius: '8px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                   <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                      <thead>
                        <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                          <th style={{ padding: '1rem', width: '15%' }}>Kıdem</th>
                          <th style={{ padding: '1rem', width: '40%' }}>Seviye Adı</th>
                          <th style={{ padding: '1rem', width: '15%' }}>Durum</th>
                          <th style={{ padding: '1rem', width: '30%', textAlign: 'right' }}>Aksiyonlar</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredLevels.map((lvl) => (
                           <tr key={lvl.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                             <td style={{ padding: '1rem', fontWeight: 'bold', color: '#0f172a' }}>{lvl.level}</td>
                             <td style={{ padding: '1rem', fontWeight: 500, color: '#334155' }}>{lvl.name}</td>
                             <td style={{ padding: '1rem' }}>
                               {lvl.isActive 
                                  ? <span style={{ background: '#dcfce7', color: '#166534', padding: '2px 8px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 600 }}>Aktif</span>
                                  : <span style={{ background: '#fee2e2', color: '#991b1b', padding: '2px 8px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 600 }}>Pasif</span>
                               }
                             </td>
                             <td style={{ padding: '1rem', textAlign: 'right', display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                                <button onClick={() => handleEditLevel(lvl)} style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '4px 8px', cursor: 'pointer', color: '#334155' }}>✏️ Düzenle</button>
                                <button onClick={() => handleToggleActiveLevel(lvl.id, lvl.isActive)} style={{ background: lvl.isActive ? '#fff1f2' : '#f0fdf4', border: `1px solid ${lvl.isActive ? '#fecdd3' : '#bbf7d0'}`, borderRadius: '4px', padding: '4px 8px', cursor: 'pointer', color: lvl.isActive ? '#e11d48' : '#16a34a' }}>
                                  {lvl.isActive ? 'Pasife Al' : 'Aktif Et'}
                                </button>
                             </td>
                           </tr>
                         ))}
                        {filteredLevels.length === 0 && (
                          <tr><td colSpan="4" style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>Sonuç bulunamadı.</td></tr>
                        )}
                      </tbody>
                   </table>
                </div>
              )}
            </>
          )}

          {/* SORUMLULUK HAVUZU GÖRÜNÜMÜ */}
          {activeCategory === 'libResponsibilities' && (
            <>
              {editingItem ? (
                <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '1.5rem', marginBottom: '1.5rem' }}>
                  <h4 style={{ margin: '0 0 1rem 0' }}>{editingItem === 'NEW' ? 'Yeni Sorumluluk Ekle' : 'Sorumluluk Düzenle'}</h4>
                  <form onSubmit={handleSaveResp} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.25rem' }}>Ait Olduğu İş Ailesi (Zorunlu)</label>
                      <select value={formData.jobFamilyId || ''} onChange={e => setFormData({...formData, jobFamilyId: e.target.value})} required style={{ width: '100%', padding: '0.6rem', borderRadius: '4px', border: '1px solid #cbd5e1' }}>
                        <option value="">-- Aile Seçin --</option>
                        {families.map(f => (
                          <option key={f.id} value={f.id}>{f.name} {f.isActive ? '' : '(Pasif)'}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.25rem' }}>Sorumluluk Başlığı (Title)</label>
                      <input type="text" value={formData.title || ''} onChange={e => setFormData({...formData, title: e.target.value})} required placeholder="Örn: Bütçe planlamasını ve kontrolünü sağlamak" style={{ width: '100%', padding: '0.6rem', borderRadius: '4px', border: '1px solid #cbd5e1' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.25rem' }}>Kapsam / Açıklama (Description)</label>
                      <textarea value={formData.description || ''} onChange={e => setFormData({...formData, description: e.target.value})} rows={3} placeholder="Sorumluluğun detaylı içeriği..." style={{ width: '100%', padding: '0.6rem', borderRadius: '4px', border: '1px solid #cbd5e1', resize: 'vertical' }} />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#fffbeb', padding: '0.5rem', borderRadius: '4px', border: '1px solid #fde68a' }}>
                      <input type="checkbox" id="isActiveCheckResp" checked={formData.isActive} onChange={e => setFormData({...formData, isActive: e.target.checked})} />
                      <div>
                        <label htmlFor="isActiveCheckResp" style={{ fontSize: '0.85rem', fontWeight: 600, color: '#92400e' }}>Aktif (Sihirbazda Önerilebilir)</label>
                        <div style={{ fontSize: '0.7rem', color: '#b45309', marginTop: '2px' }}>🔒 Müşteri reddetmedikçe veya pasife almadıkça sihirbaz adım 2'de havuzdan gelir. Geçmiş eşleşmeleri bozmaz.</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                      <button type="submit" style={{ padding: '0.6rem 1.2rem', background: '#10b981', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 500 }}>Kaydet</button>
                      <button type="button" onClick={handleCancelEdit} style={{ padding: '0.6rem 1.2rem', background: '#ef4444', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 500 }}>İptal</button>
                    </div>
                  </form>
                </div>
              ) : (
                <div style={{ background: 'white', borderRadius: '8px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                   <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                      <thead>
                        <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                          <th style={{ padding: '1rem', width: '40%' }}>Sorumluluk Alanı</th>
                          <th style={{ padding: '1rem', width: '20%' }}>İş Ailesi</th>
                          <th style={{ padding: '1rem', width: '10%' }}>Durum</th>
                          <th style={{ padding: '1rem', width: '30%', textAlign: 'right' }}>Aksiyonlar</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredResponsibilities.map((r) => {
                           const parentFam = families.find(f => f.id === r.jobFamilyId);
                           return (
                           <tr key={r.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                             <td style={{ padding: '1rem' }}>
                                <div style={{ fontWeight: 600, color: '#1e293b' }}>{r.title}</div>
                                {r.description && <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px' }}>{r.description}</div>}
                             </td>
                             <td style={{ padding: '1rem', color: '#64748b', fontSize: '0.85rem' }}>{parentFam ? parentFam.name : '-'}</td>
                             <td style={{ padding: '1rem' }}>
                               {r.isActive 
                                  ? <span style={{ background: '#dcfce7', color: '#166534', padding: '2px 8px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 600 }}>Aktif</span>
                                  : <span style={{ background: '#fee2e2', color: '#991b1b', padding: '2px 8px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 600 }}>Pasif</span>
                               }
                             </td>
                             <td style={{ padding: '1rem', textAlign: 'right', display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', alignItems: 'center' }}>
                                <button onClick={() => {
                                  setEditingItem('NEW'); 
                                  setFormData({ title: r.title + ' (Kopya)', description: r.description, jobFamilyId: r.jobFamilyId, isActive: true });
                                }} style={{ background: '#fff', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '4px 8px', cursor: 'pointer', color: '#334155' }}>📋 Kopyala</button>

                                <button onClick={() => handleEditResp(r)} style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '4px 8px', cursor: 'pointer', color: '#334155' }}>✏️ Düzenle</button>
                                
                                <button onClick={() => handleToggleActiveResp(r.id, r.isActive)} style={{ background: r.isActive ? '#fff1f2' : '#f0fdf4', border: `1px solid ${r.isActive ? '#fecdd3' : '#bbf7d0'}`, borderRadius: '4px', padding: '4px 8px', cursor: 'pointer', color: r.isActive ? '#e11d48' : '#16a34a' }}>
                                  {r.isActive ? 'Pasife Al' : 'Aktif Et'}
                                </button>
                             </td>
                           </tr>
                         )})}
                        {filteredResponsibilities.length === 0 && (
                          <tr><td colSpan="4" style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>Sonuç bulunamadı.</td></tr>
                        )}
                      </tbody>
                   </table>
                </div>
              )}
            </>
          )}


          {/* GÖREV HAVUZU GÖRÜNÜMÜ */}
          {activeCategory === 'libTasks' && (
            <>
              {editingItem ? (
                <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '1.5rem', marginBottom: '1.5rem' }}>
                  <h4 style={{ margin: '0 0 1rem 0' }}>{editingItem === 'NEW' ? 'Yeni Alt Görev Ekle' : 'Görev Düzenle'}</h4>
                  <form onSubmit={handleSaveTask} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.25rem' }}>Hangi Sorumluluk Havuzuna Bağlı? (Üst Sorumluluk)</label>
                      <select value={formData.responsibilityId || ''} onChange={e => setFormData({...formData, responsibilityId: e.target.value})} required style={{ width: '100%', padding: '0.6rem', borderRadius: '4px', border: '1px solid #cbd5e1' }}>
                        <option value="">-- Üst Sorumluluk Belirleyin --</option>
                        {respLib.map(r => (
                          <option key={r.id} value={r.id}>{r.title} {r.isActive ? '' : '(Pasif)'}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.25rem' }}>Görev (Task) Başlığı</label>
                      <input type="text" value={formData.title || ''} onChange={e => setFormData({...formData, title: e.target.value})} required placeholder="Örn: Günlük tahsilat raporlarını CRM'e işlemek" style={{ width: '100%', padding: '0.6rem', borderRadius: '4px', border: '1px solid #cbd5e1' }} />
                    </div>
                    <div>
                       <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.25rem' }}>Kritiklik Seviyesi (1 Düşük - 3 Yüksek)</label>
                       <select value={formData.criticality || 1} onChange={e => setFormData({...formData, criticality: e.target.value})} style={{ width: '150px', padding: '0.6rem', borderRadius: '4px', border: '1px solid #cbd5e1' }}>
                          <option value="1">1 - Standart</option>
                          <option value="2">2 - Önemli</option>
                          <option value="3">3 - Çok Kritik</option>
                       </select>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#fffbeb', padding: '0.5rem', borderRadius: '4px', border: '1px solid #fde68a' }}>
                      <input type="checkbox" id="isActiveCheckTask" checked={formData.isActive} onChange={e => setFormData({...formData, isActive: e.target.checked})} />
                      <div>
                        <label htmlFor="isActiveCheckTask" style={{ fontSize: '0.85rem', fontWeight: 600, color: '#92400e' }}>Aktif (Sihirbazda Görünsün)</label>
                        <div style={{ fontSize: '0.7rem', color: '#b45309', marginTop: '2px' }}>🔒 Pasife alınan görev, sihirbazın 2. adımında bağlı olduğu sorumluluk seçilse dahi listelenmez.</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                      <button type="submit" style={{ padding: '0.6rem 1.2rem', background: '#10b981', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 500 }}>Kaydet</button>
                      <button type="button" onClick={handleCancelEdit} style={{ padding: '0.6rem 1.2rem', background: '#ef4444', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 500 }}>İptal</button>
                    </div>
                  </form>
                </div>
              ) : (
                <div style={{ background: 'white', borderRadius: '8px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                   <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                      <thead>
                        <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                          <th style={{ padding: '1rem', width: '40%' }}>Görev Tanımı</th>
                          <th style={{ padding: '1rem', width: '20%' }}>Bağlı Sorumluluk</th>
                          <th style={{ padding: '1rem', width: '10%' }}>Risk/Kritiklik</th>
                          <th style={{ padding: '1rem', width: '30%', textAlign: 'right' }}>Aksiyonlar</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredTasks.map((t) => {
                           const parentResp = respLib.find(r => r.id === t.responsibilityId);
                           return (
                           <tr key={t.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                             <td style={{ padding: '1rem', fontWeight: 500, color: '#1e293b' }}>{t.title}</td>
                             <td style={{ padding: '1rem', color: '#64748b', fontSize: '0.85rem' }}>{parentResp ? parentResp.title : 'Bağımsız (Hata)'}</td>
                             <td style={{ padding: '1rem' }}>
                                <span style={{ padding: '2px 6px', background: t.criticality > 2 ? '#fee2e2' : '#f1f5f9', color: t.criticality > 2 ? '#b91c1c' : '#475569', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600 }}>C: {t.criticality}</span>
                             </td>
                             <td style={{ padding: '1rem', textAlign: 'right', display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', alignItems: 'center' }}>
                                <button onClick={() => {
                                  setEditingItem('NEW'); 
                                  setFormData({ title: t.title + ' (Kopya)', responsibilityId: t.responsibilityId, criticality: t.criticality, isActive: true });
                                }} style={{ background: '#fff', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '4px 8px', cursor: 'pointer', color: '#334155' }}>📋 Kopyala</button>

                                <button onClick={() => handleEditTask(t)} style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '4px 8px', cursor: 'pointer', color: '#334155' }}>✏️ Düzenle</button>
                                
                                <button onClick={() => handleToggleActiveTask(t.id, t.isActive)} style={{ background: t.isActive ? '#fff1f2' : '#f0fdf4', border: `1px solid ${t.isActive ? '#fecdd3' : '#bbf7d0'}`, borderRadius: '4px', padding: '4px 8px', cursor: 'pointer', color: t.isActive ? '#e11d48' : '#16a34a' }}>
                                  {t.isActive ? 'Pasife Al' : 'Aktif Et'}
                                </button>
                             </td>
                           </tr>
                         )})}
                        {filteredTasks.length === 0 && (
                          <tr><td colSpan="4" style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>Sonuç bulunamadı.</td></tr>
                        )}
                      </tbody>
                   </table>
                </div>
              )}
            </>
          )}

          {/* YETKİNLİK, BECERİ, BİLGİ, SERTİFİKA ORTAK GÖRÜNÜMÜ */}
          {genericCfg && (
             <>
                {editingItem ? (
                  <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '1.5rem', marginBottom: '1.5rem' }}>
                    <h4 style={{ margin: '0 0 1rem 0' }}>{editingItem === 'NEW' ? `Yeni ${genericCfg.label} Ekle` : `${genericCfg.label} Düzenle`}</h4>
                    <form onSubmit={handleSaveGeneric} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.25rem' }}>Önerileceği İş Ailesi (İsteğe Bağlı)</label>
                        <select value={formData.familyId || ''} onChange={e => setFormData({...formData, familyId: e.target.value})} style={{ width: '100%', padding: '0.6rem', borderRadius: '4px', border: '1px solid #cbd5e1' }}>
                          <option value="">-- Tüm Aileler (Bağımsız Master Data) --</option>
                          {families.map(f => (
                            <option key={f.id} value={f.id}>{f.name} {f.isActive ? '' : '(Pasif)'}</option>
                          ))}
                        </select>
                        <p style={{ margin: '4px 0 0 0', fontSize: '0.75rem', color: '#64748b' }}>Eğer boş bırakırsanız sihirbazın Master Data listesine eklenir, ancak doğrudan öneri olarak çıkmaz.</p>
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.25rem' }}>{genericCfg.label} Adı (Title)</label>
                        <input type="text" value={formData.title || ''} onChange={e => setFormData({...formData, title: e.target.value})} required placeholder={`Örn: Yeni ${genericCfg.label} Tanımı`} style={{ width: '100%', padding: '0.6rem', borderRadius: '4px', border: '1px solid #cbd5e1' }} />
                      </div>
                      <div style={{ marginTop: '0.5rem', marginBottom: '0.5rem' }}>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.25rem', color: '#6366f1' }}>⚡ Aksiyon Bağlantısı: Test Tetikleyici (İsteğe Bağlı)</label>
                        <select value={formData.linkedTestId || ''} onChange={e => setFormData({...formData, linkedTestId: e.target.value})} style={{ width: '100%', padding: '0.6rem', borderRadius: '4px', border: '1px solid #a5b4fc', background: '#eef2ff' }}>
                          <option value="">-- Çıktıda Test Önerme --</option>
                          {testCatalog.filter(t => t.group === 'psikometrik' || t.group === 'yetenek').map(t => (
                            <option key={t.id} value={t.id}>{t.title} ({t.group})</option>
                          ))}
                        </select>
                        <p style={{ margin: '4px 0 0 0', fontSize: '0.75rem', color: '#64748b' }}>Eğer bağlanırsa, sihirbazda bu yetkinlik seçildiğinde önizlemede otomatik olarak bu testin ataması teklif edilir.</p>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#fffbeb', padding: '0.5rem', borderRadius: '4px', border: '1px solid #fde68a' }}>
                        <input type="checkbox" id="isActiveCheckGen" checked={formData.isActive} onChange={e => setFormData({...formData, isActive: e.target.checked})} />
                        <div>
                          <label htmlFor="isActiveCheckGen" style={{ fontSize: '0.85rem', fontWeight: 600, color: '#92400e' }}>Aktif (Sihirbazda Görülebilir)</label>
                          <div style={{ fontSize: '0.7rem', color: '#b45309', marginTop: '2px' }}>🔒 Geçmiş formlar bozulmaz, yalnızca yeni eklemelerde havuzdan çekilir.</div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                        <button type="submit" style={{ padding: '0.6rem 1.2rem', background: '#10b981', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 500 }}>Kaydet</button>
                        <button type="button" onClick={handleCancelEdit} style={{ padding: '0.6rem 1.2rem', background: '#ef4444', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 500 }}>İptal</button>
                      </div>
                    </form>
                  </div>
                ) : (
                  <div style={{ background: 'white', borderRadius: '8px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                     <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                        <thead>
                          <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                            <th style={{ padding: '1rem', width: '40%' }}>{genericCfg.label} Tanımı</th>
                            <th style={{ padding: '1rem', width: '20%' }}>Bağlı İş Ailesi</th>
                            <th style={{ padding: '1rem', width: '10%' }}>Durum</th>
                            <th style={{ padding: '1rem', width: '30%', textAlign: 'right' }}>Aksiyonlar</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredGeneric.map((item) => {
                             const parentFam = item.familyId ? families.find(f => f.id === item.familyId) : null;
                             return (
                             <tr key={item.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                               <td style={{ padding: '1rem', fontWeight: 500, color: '#1e293b' }}>{item.title}</td>
                               <td style={{ padding: '1rem', color: parentFam ? '#334155' : '#94a3b8', fontSize: '0.85rem' }}>
                                 {parentFam ? parentFam.name : 'Bağımsız Master Veri'}
                               </td>
                               <td style={{ padding: '1rem' }}>
                                 {item.isActive 
                                    ? <span style={{ background: '#dcfce7', color: '#166534', padding: '2px 8px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 600 }}>Aktif</span>
                                    : <span style={{ background: '#fee2e2', color: '#991b1b', padding: '2px 8px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 600 }}>Pasif</span>
                                 }
                               </td>
                               <td style={{ padding: '1rem', textAlign: 'right', display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', alignItems: 'center' }}>
                                  <button onClick={() => {
                                    setEditingItem('NEW'); 
                                    setFormData({ title: item.title + ' (Kopya)', familyId: item.familyId, isActive: true });
                                  }} style={{ background: '#fff', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '4px 8px', cursor: 'pointer', color: '#334155' }}>📋 Kopyala</button>
  
                                  <button onClick={() => handleEditGeneric(item)} style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '4px 8px', cursor: 'pointer', color: '#334155' }}>✏️ Düzenle</button>
                                  
                                  <button onClick={() => handleToggleActiveGeneric(item.id, item.isActive)} style={{ background: item.isActive ? '#fff1f2' : '#f0fdf4', border: `1px solid ${item.isActive ? '#fecdd3' : '#bbf7d0'}`, borderRadius: '4px', padding: '4px 8px', cursor: 'pointer', color: item.isActive ? '#e11d48' : '#16a34a' }}>
                                    {item.isActive ? 'Pasife Al' : 'Aktif Et'}
                                  </button>
                               </td>
                             </tr>
                           )})}
                          {filteredGeneric.length === 0 && (
                            <tr><td colSpan="4" style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>Sonuç bulunamadı.</td></tr>
                          )}
                        </tbody>
                     </table>
                  </div>
                )}
             </>
          )}

          {/* DİĞERLERİ YAPIM AŞAMASINDA */}
          {!['jobFamilies', 'jobFunctions', 'jobLevels', 'libResponsibilities', 'libTasks'].includes(activeCategory) && !genericCfg && (
            <div style={{ textAlign: 'center', padding: '4rem 0', color: '#94a3b8' }}>
              <h3>🚧 Yapım Aşamasında (Faz 3.5 Devamı)</h3>
              <p>İlk onayın ardından Job Functions, Job Levels, Responsibility ve Tasks tabloları eklenecektir.</p>
            </div>
          )}

        </div>
      </div>

      {/* SAĞ KOLON - Mini Rehber */}
      <div className="mdm-guide glass" style={{ width: '280px', flexShrink: 0, padding: '1.5rem', borderRadius: '12px', alignSelf: 'flex-start', background: '#f8fafc', border: '1px solid #e2e8f0' }}>
        <h4 style={{ margin: '0 0 1rem 0', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span>{activeGuide.title}</span>
        </h4>
        <p style={{ fontSize: '0.85rem', color: '#475569', lineHeight: '1.5', margin: 0 }}>
          {activeGuide.text}
        </p>
      </div>

      {/* AI BULK GENERATOR MODAL */}
      {aiBulkModal.isOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15, 23, 42, 0.7)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' }}>
           <div className="fade-in" style={{ background: '#fff', borderRadius: '16px', padding: '2.5rem', width: '100%', maxWidth: '550px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}>
             <h2 style={{ margin: '0 0 1rem 0', display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#1e293b' }}>
                <span style={{ fontSize: '2rem' }}>🪄</span> Kütüphane Yaratıcısı
             </h2>
             <p style={{ color: '#64748b', fontSize: '0.95rem', marginBottom: '2rem', lineHeight: '1.6' }}>
                Kurmak istediğiniz departmanı / iş ailesini yazın. Yapay zeka sizin için sektörel standartlarda sorumluluk, görev ve test bağlantılı yetkinlik setlerini Master Data kütüphanenize otomatik işlesin.
             </p>
             <div style={{ marginBottom: '1.5rem' }}>
               <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem', color: '#334155' }}>Hedeflenen İş Ailesi (Job Family)</label>
               <input 
                 type="text" 
                 value={aiBulkModal.familyName} 
                 onChange={e => setAiBulkModal(prev => ({...prev, familyName: e.target.value}))} 
                 placeholder="Örn: Finans, Pazarlama, Ar-Ge..." 
                 style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '2px solid #e2e8f0', fontSize: '1.05rem', outline: 'none' }} 
                 disabled={aiBulkModal.isLoading}
                 autoFocus
               />
             </div>
             <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '2rem' }}>
               <button 
                 onClick={() => setAiBulkModal({isOpen: false, familyName: '', isLoading: false})} 
                 style={{ padding: '0.6rem 1.5rem', background: '#f1f5f9', color: '#475569', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}
                 disabled={aiBulkModal.isLoading}
               >İptal</button>
               <button 
                 onClick={handleAIBulkLoad} 
                 style={{ padding: '0.6rem 1.5rem', background: 'linear-gradient(to right, #8b5cf6, #4f46e5)', color: '#fff', border: 'none', borderRadius: '8px', cursor: aiBulkModal.isLoading ? 'wait' : 'pointer', fontWeight: 700, minWidth: '150px' }}
                 disabled={aiBulkModal.isLoading || !aiBulkModal.familyName.trim()}
               >
                 {aiBulkModal.isLoading ? 'Üretiliyor...' : 'Sihirbazı Başlat'}
               </button>
             </div>
           </div>
        </div>
      )}

    </div>
  );
}
