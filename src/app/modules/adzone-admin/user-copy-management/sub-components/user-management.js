const userAccessControlContent = {
  stepsMenu : [
    {
      key: 'upload_access',
      head: 'Upload Access',
      active: 1,
    },
    {
      key: 'download_access',
      head: 'Download Access',
      active: 2,
    },
    {
      key: 'view_access',
      head: 'View Access',
      active: 3,
    }
  ],

  uploadAccessForm: {
    submitButtonLabel: 'Apply',
    cancelButtonLabel: 'Cancel',
    subModuleSlug: 'create_doc',
    formInputs: [
      {
        label: 'Choose Regions',
        model: 'regions',
        type: 'select',
        markAsRequired: true,
        options: 'regionOptions',
        selectedOptions: 'regionSelectedOptions',
        isChangeEvent: true,
        callBack: 'loadSubByRegions',
        errors: [{
          key: "required",
          message: "Regions is required",
        }],
      },
      {
        label: 'Choose Sub Regions',
        model: 'subRegions',
        type: 'select',
        markAsRequired: true,
        options: 'subRegionOptions',
        selectedOptions: 'subRegionSelectedOptions',
        isChangeEvent: true,
        callBack: 'loadDivBySub',
        errors: [{
          key: "required",
          message: "Sub Regions is required",
        }],
      },
      {
        label: 'Choose Division',
        model: 'divisions',
        type: 'select',
        markAsRequired: true,
        options: 'divionsOptions',
        selectedOptions: 'divisionSelectedOptions',
        isChangeEvent: true,
        callBack: 'loadCountryByDiv',
        errors: [{
          key: "required",
          message: "Division is required",
        }],
      },
      {
        label: 'Choose Market',
        model: 'markets',
        type: 'select',
        markAsRequired: true,
        options: 'marketOptions',
        selectedOptions: 'marketSelectedOptions',
        isChangeEvent: false,
        // callBack: 'loaddealerByMarket',
        errors: [{
          key: "required",
          message: "Market is required",
        }],
      }
    ]
  },

  downloadAccessForm: {
    submitButtonLabel: 'Apply',
    cancelButtonLabel: 'Cancel',
    subModuleSlug: 'download_doc',
    formInputs: [
      {
        label: 'Choose Regions',
        model: 'regions',
        type: 'select',
        markAsRequired: true,
        options: 'regionOptions',
        selectedOptions: 'downloadRegionSelectedOptions',
        isChangeEvent: true,
        callBack: 'loadSubByRegions',
        errors: [{
          key: "required",
          message: "Regions is required",
        }],
      },
      {
        label: 'Choose Sub Regions',
        model: 'subRegions',
        type: 'select',
        markAsRequired: true,
        options: 'subRegionOptions',
        selectedOptions: 'downloadSubRegionSelectedOptions',
        isChangeEvent: true,
        callBack: 'loadDivBySub',
        errors: [{
          key: "required",
          message: "Sub Regions is required",
        }],
      },
      {
        label: 'Choose Division',
        model: 'divisions',
        type: 'select',
        markAsRequired: true,
        options: 'divionsOptions',
        selectedOptions: 'downloadDivisionSelectedOptions',
        isChangeEvent: true,
        callBack: 'loadCountryByDiv',
        errors: [{
          key: "required",
          message: "Division is required",
        }],
      },
      {
        label: 'Choose Market',
        model: 'markets',
        type: 'select',
        markAsRequired: true,
        options: 'marketOptions',
        selectedOptions: 'downloadMarketSelectedOptions',
        isChangeEvent: false,
        // callBack: 'loaddealerByMarket',
        errors: [{
          key: "required",
          message: "Market is required",
        }],
      }
    ]
  },

  viewAccessForm: {
    submitButtonLabel: 'Apply',
    cancelButtonLabel: 'Cancel',
    subModuleSlug: 'view_doc',
    formInputs : [
      {
        label: 'Choose Regions',
        model: 'regions',
        type: 'select',
        markAsRequired: true,
        options: 'regionOptions',
        selectedOptions: 'viewRegionSelectedOptions',
        isChangeEvent: true,
        callBack: 'loadSubByRegions',
        errors: [{
          key: "required",
          message: "Regions is required",
        }],
      },
      {
        label: 'Choose Sub Regions',
        model: 'subRegions',
        type: 'select',
        markAsRequired: true,
        options: 'subRegionOptions',
        selectedOptions: 'viewSubRegionSelectedOptions',
        isChangeEvent: true,
        callBack: 'loadDivBySub',
        errors: [{
          key: "required",
          message: "Sub Regions is required",
        }],
      },
      {
        label: 'Choose Division',
        model: 'divisions',
        type: 'select',
        markAsRequired: true,
        options: 'divionsOptions',
        selectedOptions: 'viewDivisionSelectedOptions',
        isChangeEvent: true,
        callBack: 'loadCountryByDiv',
        errors: [{
          key: "required",
          message: "Division is required",
        }],
      },
      {
        label: 'Choose Market',
        model: 'markets',
        type: 'select',
        markAsRequired: true,
        options: 'marketOptions',
        selectedOptions: 'viewMarketSelectedOptions',
        isChangeEvent: false,
        errors: [{
          key: "required",
          message: "Market is required",
        }],
      }
    ]
  }
};

export {
  userAccessControlContent
};
