// src/engine/MetadataEngine.js
export const MetadataEngine = {
  // Generate a dynamic form skeleton based on metadata fields
  generateFormSkeleton: (entityType, metadataFields) => {
    const fields = metadataFields.filter(f => f.entityType === entityType);
    const skeleton = {};
    fields.forEach(f => {
      if (f.type === 'NUMBER') skeleton[f.id] = 0;
      else if (f.type === 'LOOKUP') skeleton[f.id] = f.options ? f.options[0] : '';
      else skeleton[f.id] = '';
    });
    return skeleton;
  },

  // Helper to render dynamic fields dynamically in UI
  renderFieldSetup: (field, value, onChange) => {
    // In a real generic engine, this would return JSX directly or configuration objects for a form builder.
    return { field, value, onChange };
  }
};

// src/engine/RuleEngine.js
export const RuleEngine = {
  validateTemplate: (template, db) => {
    const errors = [];
    const warnings = [];

    // Rule 1: Ağırlıklı Grupların Kendi İçinde 100 Olması
    const WEIGHTED_TYPES = ['COMPETENCY', 'TASK', 'SKILL', 'KPI', 'RESPONSIBILITY'];
    
    if (template.items && template.items.length > 0) {
      // Gruplama yap
      const itemsByType = {};
      template.items.forEach(it => {
        const lib = db.library.find(l => l.id === it.libraryItemId);
        if (lib) {
          if (!itemsByType[lib.type]) itemsByType[lib.type] = [];
          itemsByType[lib.type].push(it);
        }
      });

      // Her ağırlıklı grubu kontrol et
      WEIGHTED_TYPES.forEach(type => {
        const groupItems = itemsByType[type];
        if (groupItems && groupItems.length > 0) {
          const sum = groupItems.reduce((acc, item) => acc + (Number(item.weight) || 0), 0);
          if (sum !== 100) {
            errors.push(`[${type}] kategorisindeki öğelerin ağırlık toplamı 100 olmalıdır. (Şu an: ${sum})`);
          }
        }
      });
    }

    // Rule 2: Seviye Kuralları -> "Yönetici" veya "Direktör" ise "Liderlik" yetkinliği mandatory olmalı
    const isLeadershipRole = template.level && (template.level.includes('Yönetici') || template.level.includes('Direktör'));
    if (isLeadershipRole) {
      const hasLeadership = template.items?.some(it => {
        const libItem = db.library.find(l => l.id === it.libraryItemId);
        return libItem && libItem.type === 'COMPETENCY' && libItem.name.toLowerCase().includes('liderlik');
      });

      if (!hasLeadership) {
        warnings.push(`${template.level} seviyesindeki bir rol "Liderlik" yetkinliği içermelidir.`);
      }
    }

    // Rule 3: Dynamic Metadata validation
    db.metadataFields.filter(f => f.entityType === 'ROLE_TEMPLATE').forEach(field => {
      if (field.required && (!template.customFields || !template.customFields[field.id])) {
        errors.push(`Gerekli özel alan doldurulmadı: ${field.name}`);
      }
    });

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }
};
