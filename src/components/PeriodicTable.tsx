import { useState } from 'react';
import { ELEMENTS, CATEGORY_COLORS, type Element } from '../data/periodicTable';

export function PeriodicTable() {
  const [selectedElement, setSelectedElement] = useState<Element | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = ['all', ...Object.keys(CATEGORY_COLORS)];

  const filteredElements = ELEMENTS.filter(element => {
    const matchesSearch = searchQuery === '' || 
      element.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      element.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      element.atomicNumber.toString().includes(searchQuery);
    
    const matchesCategory = selectedCategory === 'all' || element.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="fade-in">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg" style={{ background: 'linear-gradient(135deg, #16a34a, #15803d)' }}>
            <span style={{ color: 'white' }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="1"/>
                <path d="M20.2 20.2c2.04-2.03.02-7.36-4.5-11.9-4.54-4.52-9.87-6.54-11.9-4.5-2.04 2.03-.02 7.36 4.5 11.9 4.54 4.52 9.87 6.54 11.9 4.5Z"/>
                <path d="M15.7 15.7c4.52-4.54 6.54-9.87 4.5-11.9-2.03-2.04-7.36-.02-11.9 4.5-4.52 4.54-6.54 9.87-4.5 11.9 2.03 2.04 7.36.02 11.9-4.5Z"/>
              </svg>
            </span>
          </div>
          <div>
            <h2 className="text-3xl font-bold" style={{ color: 'var(--text)' }}>Periodic Table</h2>
            <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
              Interactive chemistry learning tool • {ELEMENTS.length} elements
            </p>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="mb-6 space-y-4">
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-tertiary)' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/>
              <path d="m21 21-4.3-4.3"/>
            </svg>
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, symbol, or atomic number..."
            className="w-full pl-11 pr-4 py-3 rounded-xl text-sm transition-all focus:ring-2 focus:ring-green-500/20"
            style={{ background: 'var(--card)', border: '1.5px solid var(--border)', color: 'var(--text)' }}
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className="subject-pill text-xs font-semibold px-4 py-2 rounded-full whitespace-nowrap transition-all"
              style={{
                background: selectedCategory === category ? '#16a34a' : 'var(--card)',
                color: selectedCategory === category ? 'white' : 'var(--text-secondary)',
                border: `1.5px solid ${selectedCategory === category ? '#16a34a' : 'var(--border)'}`
              }}
            >
              {category === 'all' ? 'All Categories' : category}
            </button>
          ))}
        </div>
      </div>

      {/* Periodic Table Grid */}
      <div className="rounded-2xl p-6 mb-8" style={{ background: 'var(--card)', border: '1.5px solid var(--border)' }}>
        <div className="grid grid-cols-18 gap-1" style={{ gridTemplateColumns: 'repeat(18, minmax(0, 1fr))' }}>
          {filteredElements.map(element => (
            <button
              key={element.atomicNumber}
              onClick={() => setSelectedElement(element)}
              className="aspect-square rounded-lg p-1 text-center transition-all hover:scale-110 hover:shadow-lg"
              style={{
                background: CATEGORY_COLORS[element.category] || 'var(--bg2)',
                gridColumn: element.group || 1,
                gridRow: element.period
              }}
              title={`${element.name} (${element.symbol})`}
            >
              <div className="text-[8px] font-bold" style={{ color: 'white' }}>
                {element.atomicNumber}
              </div>
              <div className="text-sm font-bold" style={{ color: 'white' }}>
                {element.symbol}
              </div>
            </button>
          ))}
        </div>

        {/* Legend */}
        <div className="mt-6 pt-6 border-t" style={{ borderColor: 'var(--border)' }}>
          <div className="text-xs font-semibold mb-3" style={{ color: 'var(--text)' }}>Element Categories</div>
          <div className="flex flex-wrap gap-2">
            {Object.entries(CATEGORY_COLORS).map(([category, color]) => (
              <div key={category} className="flex items-center gap-2">
                <div className="w-4 h-4 rounded" style={{ background: color }} />
                <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>{category}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Element Detail Modal */}
      {selectedElement && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}>
          <div className="max-w-4xl w-full max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl" style={{ background: 'var(--card)', border: '1.5px solid var(--border)' }}>
            {/* Modal Header */}
            <div className="sticky top-0 p-6 flex items-center justify-between" style={{ background: 'var(--card)', borderBottom: '1px solid var(--border)' }}>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl flex items-center justify-center text-2xl font-bold" style={{ 
                  background: CATEGORY_COLORS[selectedElement.category],
                  color: 'white'
                }}>
                  {selectedElement.symbol}
                </div>
                <div>
                  <h3 className="text-2xl font-bold" style={{ color: 'var(--text)' }}>{selectedElement.name}</h3>
                  <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
                    Atomic Number: {selectedElement.atomicNumber} • {selectedElement.category}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedElement(null)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                style={{ color: 'var(--text-tertiary)' }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6 6 18"/>
                  <path d="m6 6 12 12"/>
                </svg>
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Basic Properties */}
              <div>
                <h4 className="text-lg font-bold mb-3" style={{ color: 'var(--text)' }}>Basic Properties</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-3 rounded-lg" style={{ background: 'var(--bg2)' }}>
                    <div className="text-xs mb-1" style={{ color: 'var(--text-tertiary)' }}>Atomic Mass</div>
                    <div className="text-sm font-semibold" style={{ color: 'var(--text)' }}>{selectedElement.atomicMass} u</div>
                  </div>
                  <div className="p-3 rounded-lg" style={{ background: 'var(--bg2)' }}>
                    <div className="text-xs mb-1" style={{ color: 'var(--text-tertiary)' }}>Electron Config</div>
                    <div className="text-sm font-semibold font-mono" style={{ color: 'var(--text)' }}>{selectedElement.electronConfiguration}</div>
                  </div>
                  <div className="p-3 rounded-lg" style={{ background: 'var(--bg2)' }}>
                    <div className="text-xs mb-1" style={{ color: 'var(--text-tertiary)' }}>Phase</div>
                    <div className="text-sm font-semibold capitalize" style={{ color: 'var(--text)' }}>{selectedElement.phase}</div>
                  </div>
                  <div className="p-3 rounded-lg" style={{ background: 'var(--bg2)' }}>
                    <div className="text-xs mb-1" style={{ color: 'var(--text-tertiary)' }}>Block</div>
                    <div className="text-sm font-semibold" style={{ color: 'var(--text)' }}>{selectedElement.block}-block</div>
                  </div>
                </div>
              </div>

              {/* Physical Properties */}
              <div>
                <h4 className="text-lg font-bold mb-3" style={{ color: 'var(--text)' }}>Physical Properties</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {selectedElement.electronegativity && (
                    <div className="p-3 rounded-lg" style={{ background: 'var(--bg2)' }}>
                      <div className="text-xs mb-1" style={{ color: 'var(--text-tertiary)' }}>Electronegativity</div>
                      <div className="text-sm font-semibold" style={{ color: 'var(--text)' }}>{selectedElement.electronegativity}</div>
                    </div>
                  )}
                  {selectedElement.ionizationEnergy && (
                    <div className="p-3 rounded-lg" style={{ background: 'var(--bg2)' }}>
                      <div className="text-xs mb-1" style={{ color: 'var(--text-tertiary)' }}>Ionization Energy</div>
                      <div className="text-sm font-semibold" style={{ color: 'var(--text)' }}>{selectedElement.ionizationEnergy} kJ/mol</div>
                    </div>
                  )}
                  {selectedElement.atomicRadius && (
                    <div className="p-3 rounded-lg" style={{ background: 'var(--bg2)' }}>
                      <div className="text-xs mb-1" style={{ color: 'var(--text-tertiary)' }}>Atomic Radius</div>
                      <div className="text-sm font-semibold" style={{ color: 'var(--text)' }}>{selectedElement.atomicRadius} pm</div>
                    </div>
                  )}
                </div>
              </div>

              {/* Description */}
              <div>
                <h4 className="text-lg font-bold mb-3" style={{ color: 'var(--text)' }}>Description</h4>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  {selectedElement.description}
                </p>
              </div>

              {/* Exam Relevance */}
              <div>
                <h4 className="text-lg font-bold mb-3" style={{ color: 'var(--text)' }}>Exam Relevance</h4>
                <div className="space-y-3">
                  <div className="p-4 rounded-lg" style={{ background: 'rgba(37, 99, 235, 0.05)', border: '1px solid rgba(37, 99, 235, 0.2)' }}>
                    <div className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: '#2563eb' }}>JEE Main</div>
                    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{selectedElement.examRelevance.jeeMain}</p>
                  </div>
                  <div className="p-4 rounded-lg" style={{ background: 'rgba(124, 58, 237, 0.05)', border: '1px solid rgba(124, 58, 237, 0.2)' }}>
                    <div className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: '#7c3aed' }}>JEE Advanced</div>
                    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{selectedElement.examRelevance.jeeAdvanced}</p>
                  </div>
                  <div className="p-4 rounded-lg" style={{ background: 'rgba(22, 163, 74, 0.05)', border: '1px solid rgba(22, 163, 74, 0.2)' }}>
                    <div className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: '#16a34a' }}>HSC Board</div>
                    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{selectedElement.examRelevance.hsc}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
