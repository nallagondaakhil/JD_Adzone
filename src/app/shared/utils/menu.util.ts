export class MenuUtil {
    static routeMappings: {[key: string]: string} = {
        'ACTIVITY MANAGEMENT': '/admin/activity-master',
        'Timeline Master': '/admin/cliam-timeline-master',
        'Upload Status': '/admin/upload-status',
        'Download Status': '/admin/download-status',
        'Company Management': '/admin/',
        'Location Master': '/admin/locations-management',
        'REFERENCE DOCUMENTS': '/admin/reference-document',
        'ROLES MANAGEMENT': '/admin/role-management',
        'USERS MANAGEMENT': '/admin/user-management',
        'VCMS WORKFLOW MANAGEMENT': '/admin/claims-workflow-management',
        'VENDOR PROFILES': '/admin/vendor-management',
        'VENDOR SERVICE REQUESTS': '/vcms/service-request',
        'My Claims': '/vcms/my-claims',
    };

    static getRouterPath(menuName: string) {
        return MenuUtil.routeMappings[menuName];
    }
}
