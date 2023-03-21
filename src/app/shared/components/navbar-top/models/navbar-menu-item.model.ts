export interface NavbarMenuItem {
    name: string;
    id?:number;
    label: string;
    customClass?: string;
    isActive?: boolean;
    menuType: 'icon' | 'link' | 'dropdown';
    svgIcon?: string;
    showDivider?: boolean;
    onClick: (menu: NavbarMenuItem) => void;
    children?: NavbarMenuItem[];
    parent?: NavbarMenuItem;
    url?: string;
    subMenu?: Array<{
        id: number,
        subMenuUrl: string,
    }>
}

export interface AllNavbarMenuItem {
    menuName: string;
    id?:number;
    label: string;
    customClass?: string;
    isActive?: boolean;
    menuType: 'icon' | 'link' | 'dropdown';
    svgIcon?: string;
    showDivider?: boolean;
    onClick: (menu: NavbarMenuItem) => void;
    children?: NavbarMenuItem[];
    parent?: NavbarMenuItem;
    menuUrl?: string;
}
