export interface ComponentCategory {
    key: string
    label: string
}

export const componentCategories: ComponentCategory[] = [
    { key: 'cpu', label: 'CPU' },
    { key: 'gpu', label: 'GPU' },
    { key: 'motherboard', label: 'Motherboard' },
    { key: 'ram', label: 'RAM' },
    { key: 'storage', label: 'Storage' },
    { key: 'psu', label: 'Power Supply' },
    { key: 'cooling', label: 'Cooling' },
    { key: 'case', label: 'Case' },
]