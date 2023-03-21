export class RolesDependancyClass {
    static rolesDependancy = [
        {
            subModules: [
                {
                    key : 'Create',
                    dependency: [],
                },
                {
                    key : 'View',
                    dependency: [],
                },
                {
                    key : 'Edit',
                    dependency: [],
                },
                {
                    key : 'Activate',
                    dependency: ['Deactivate'],
                },
                {
                    key : 'Deactivate',
                    dependency: ['Activate'],
                },
                {
                    key : 'Delete',
                    dependency: [],
                },
                {
                    key : 'Bulk Upload',
                    dependency: [],
                },
            ],
            key: 'User Management'
        },
        {
            subModules: [
                {
                    key : 'Create',
                    dependency: [],
                },
                {
                    key : 'View',
                    dependency: [],
                },
                {
                    key : 'Edit',
                    dependency: [],
                },
                {
                    key : 'Activate',
                    dependency: ['Deactivate'],
                },
                {
                    key : 'Deactivate',
                    dependency: ['Activate'],
                },
                {
                    key : 'Delete',
                    dependency: [],
                },
                {
                    key : 'Bulk Upload',
                    dependency: [],
                },
            ],
            key: 'Vendor Management'
        },
        {

            subModules: [
                {
                    key : 'View',
                    dependency: []
                },
            ],
            key: 'Dealer Management'
        },
        {
            subModules: [
                {
                    key : 'Create',
                    dependency: [],
                },
                {
                    key : 'View',
                    dependency: [],
                },
                {
                    key : 'Edit',
                    dependency: [],
                },
                {
                    key : 'Activate',
                    dependency: ['Deactivate'],
                },
                {
                    key : 'Deactivate',
                    dependency: ['Activate'],
                },
                {
                    key : 'Delete',
                    dependency: [],
                },
                
            ],
            key: 'Role Management'
        },
        {
            subModules: [
                {
                    key : 'Create',
                    dependency: [],
                },
                {
                    key : 'View',
                    dependency: [],
                },
                {
                    key : 'Edit',
                    dependency: [],
                },
                {
                    key : 'Activate',
                    dependency: ['Deactivate'],
                },
                {
                    key : 'Deactivate',
                    dependency: ['Activate'],
                },
                {
                    key : 'Delete',
                    dependency: [],
                },
                
            ],
            key: 'Document Category'
        },
        {
            subModules: [
                {
                    key : 'Create',
                    dependency: [],
                },
                {
                    key : 'View',
                    dependency: [],
                },
                {
                    key : 'Edit',
                    dependency: [],
                },
                {
                    key : 'Activate',
                    dependency: ['Deactivate'],
                },
                {
                    key : 'Deactivate',
                    dependency: ['Activate'],
                },
                {
                    key : 'Delete',
                    dependency: [],
                },
                
            ],
            key: 'Document Sub Category'
        },
        {
            subModules: [
                
                {
                    key : 'Edit',
                    dependency: [],
                },
                {
                    key : 'Activate',
                    dependency: ['Deactivate'],
                },
                {
                    key : 'Deactivate',
                    dependency: ['Activate'],
                },
                {
                    key : 'Delete',
                    dependency: [],
                },
                {
                    key : 'Create',
                    dependency: [],
                },
                {
                    key : 'View',
                    dependency: [],
                },
                
            ],
            key: 'Documents'
        },
        {
            subModules: [
                {
                    key : 'Create',
                    dependency: [],
                },
                {
                    key : 'View',
                    dependency: [],
                },
                {
                    key : 'Edit',
                    dependency: [],
                },
                {
                    key : 'Activate',
                    dependency: ['Deactivate'],
                },
                {
                    key : 'Deactivate',
                    dependency: ['Activate'],
                },
                {
                    key : 'Delete',
                    dependency: [],
                },
                
            ],
            key: 'Printable Material'
        },
        {
            subModules: [

                {
                    key : 'View',
                    dependency: [],
                },
                {
                    key : 'Edit',
                    dependency: [],
                },
                
            ],
            key: 'Order Management'
        },
        {
            subModules: [
                {
                    key : 'Documents Downloaded Report',
                    dependency: [],
                },
                {
                    key : 'Documents Uploaded Report',
                    dependency: [],
                },
                {
                    key : 'Dealer Order Report',
                    dependency: [],
                },
                {
                    key : 'User Activity Report',
                    dependency: [],
                },
                {
                    key : 'Dealer Logged In Report',
                    dependency: [],
                },
                {
                    key : 'Document Category Report',
                    dependency: [],
                },
                
            ],
            key: 'Report Management'
        },
        {
            subModules: [
                
            ],
            key: 'Template Management'
        },
        {
            subModules: [

                {
                    key : 'View Access',
                    dependency: [],
                },
                
            ],
            key: 'Dashboard'
        },
        {
            subModules: [

                {
                    key : 'View Access',
                    dependency: [],
                },
                {
                    key : 'Download Access',
                    dependency: [],
                },
                
            ],
            key: 'Dealer View'
        },
    ];
}
