export const MenuList = [
  //Dashboard
  // {
  //   title: "Dashboard",
  //   classsChange: "mm-collapse",
  //   iconStyle: <i className="fas fa-home" />,
  //   content: [
  //     {
  //       title: "Dashboard Light",
  //       to: "dashboard",
  //     },
  //     {
  //       title: "Dashboard Dark",
  //       to: "dashboard-dark",
  //     },
  //     {
  //         title: 'Guest List',
  //         to: 'guest-list',
  //     },
  //     {
  //         title: 'Guest Details',
  //         to: 'guest-details',
  //     },
  //     {
  //         title: 'Concierge List',
  //         to: 'concierge-list',
  //     },
  //     {
  //         title: 'Room List',
  //         to: 'room-list',
  //     },
  //     {
  //         title: 'Reviews',
  //         to: 'reviews',
  //     },
  //     {
  //         title: 'Task',
  //         to: 'task',
  //     },
  //   ],
  // },
  {
    title: "Dashboards",
    // classsChange: 'mm-collapse',
    iconStyle: <i className="fas fa-home" />,
    to: "admin-dashboard",
    content: []
  },

  //Query
  // {
  //     title: 'Queries',
  //     classsChange: 'mm-collapse',
  //     iconStyle: <i className="fas fa-info-circle"></i>,
  //     content: [
  //         {
  //             title: 'Query',
  //             to: ''
  //         },
  //         // {
  //         //     title: 'Edit Profile',
  //         //     to: 'edit-profile'
  //         // },
  //         // {
  //         //     title: 'Post Details',
  //         //     to: 'post-details'
  //         // },
  //         // {
  //         //     title: 'Email',
  //         //     //to: './',
  //         //     hasMenu : true,
  //         //     content: [
  //         //         {
  //         //             title: 'Compose',
  //         //             to: 'email-compose',
  //         //         },
  //         //         {
  //         //             title: 'Index',
  //         //             to: 'email-inbox',
  //         //         },
  //         //         {
  //         //             title: 'Read',
  //         //             to: 'email-read',
  //         //         }
  //         //     ],
  //         // },
  //         // {
  //         //     title:'Calendar',
  //         //     to: 'app-calender'
  //         // },
  //         // {
  //         //     title: 'Shop',
  //         //     //to: './',
  //         //     hasMenu : true,
  //         //     content: [
  //         //         {
  //         //             title: 'Product Grid',
  //         //             to: 'ecom-product-grid',
  //         //         },
  //         //         {
  //         //             title: 'Product List',
  //         //             to: 'ecom-product-list',
  //         //         },
  //         //         {
  //         //             title: 'Product Details',
  //         //             to: 'ecom-product-detail',
  //         //         },
  //         //         {
  //         //             title: 'Order',
  //         //             to: 'ecom-product-order',
  //         //         },
  //         //         {
  //         //             title: 'Checkout',
  //         //             to: 'ecom-checkout',
  //         //         },
  //         //         {
  //         //             title: 'Invoice',
  //         //             to: 'ecom-invoice',
  //         //         },
  //         //         {
  //         //             title: 'Customers',
  //         //             to: 'ecom-customers',
  //         //         },
  //         //     ],
  //         // },
  //     ],
  // },
  // Query
  {
    title: "Queries",
    // classsChange: 'mm-collapse',
    iconStyle: <i className="fas fa-info-circle"></i>,
    to: "queries",
  },
  // Mail
  {
    title: "Mails",
    //classsChange: 'mm-collapse',
    iconStyle: <i class="fas fa-solid fa-envelope"></i>,
    to: "mails",
  },

  {
    title: "Marketing",
    // classsChange: 'mm-collapse',
    iconStyle: <i class="fa-solid fa-shop" />,
    to: "admin-dashboard",
    content: [
      {
        title: "Lead Management",
        // to: "lead-management"
      },
      {
        title: "Meta Integration",
        // to: "meta-integration"
      },
      {
        title: "WhatsApp Integration",
        // to: "whatsapp-integration"
      },
      {
        title: "Chatbot Integration",
        // to: "chatbot-integration"
      },
      {
        title: "Website Integration",
        // to: "website-integration"
      },
      {
        "title": "MailChimp Integration",
        // "to": "mailchimp-integration"
      },
    ],
  },

  {
    title: "Sales",
    // classsChange: 'mm-collapse',
    iconStyle: <i class="fas fa-dollar-sign"></i>,
    to: "admin-dashboard",
    content: [
      {
        title: " B2B Agents",
        to: "agent"
      },
      {
        title: "Corporates",
        // to: "corporates"
      },
      {
        title: "B2C Direct Clients",
        to: "direct-client"
      },
      {
        title: "Query Distribution",
        // to: "query-distribution"
      },
      {
        title: "Cost Sheets",
        to: "costsheet"
      },
      {
        title: "Proposals/Itineraries",
        to: "proposals-itineraries"
      },
    ],
  },

  {
    title: "Operations",
    // classsChange: 'mm-collapse',
    iconStyle: <i class="fas fa-wrench"></i>,
    to: "admin-dashboard",
    content: [
      {
        title: "Suppliers",
        to: "supplier"
      },
      {
        title: " Client Vouchers",
        to: "client-vouchers"
      },
      {
        title: " Supplier Vouchers",
        to: "supplier-vouchers"
      },
      {
        title: "Task Scheduling",
        to: "task-scheduling"
      },
    ],

  },

  {
    title: "Finance",
    // classsChange: 'mm-collapse',
    iconStyle: <i class="fa-solid fa-coins" />,
    to: "admin-dashboard",
    content: [
      {
        title: "Receivables",
        // to: "receivables"
      },
      {
        title: "Payables",
        // to: "payables"
      },
      {
        title: " Invoice Type",
        to: "invoices"
      },
      // {
      //   title: "Tax Invoices",
      //   // to: "tax Invoices"
      // },
      // {
      //   title: "Pending Invoices",
      //   // to: "pending Invoices"
      // },
    ],
  },

  {
    title: "Reports",
    classsChange: "mm-collapse",
    iconStyle: <i class="fas fa-chart-bar"></i>,
    to: "report-dashboard",
  },

  {
    title: "Documents",
    classsChange: "mm-collapse",
    iconStyle: <i class="fas fa-solid fa-folder-minus"></i>,
    to: "documents",
  },
  // {
  //   title: "User Management",
  //   classsChange: "mm-collapse",
  //   iconStyle: <i className="fas fa-user"></i>,
  //   content: [
  //     {
  //       title: "Companies",
  //       to: "company",
  //     },
  //     {
  //       title: "Roles",
  //       to: "roles",
  //     },
  //     // {
  //     //   title: "Permissions",
  //     //   to: "permission",
  //     // },
  //     {
  //       title: "Users",
  //       to: "user",
  //     },
  //     // {
  //     //   title: "Organisations",
  //     //   to: "organisation",
  //     // },
  //     {
  //       title: "Modules",
  //       to: "module",
  //     },
  //     {
  //       title: "Report Chart",
  //       to: "report-chart",
  //     },
  //     // {
  //     //   title: "Profile",
  //     //   to: "profile",
  //     // },
  //   ],
  // },
  {
    title: "Masters",
    // classsChange: 'mm-collapse',
    iconStyle: <i className="fas fa-table"></i>,
    to: "masters",
  },
  //Charts
  // {
  //     title: 'Charts',
  //     classsChange: 'mm-collapse',
  //     iconStyle: <i className="fas fa-chart-line"></i>,
  //     content: [

  //         {
  //             title: 'RechartJs',
  //             to: 'chart-rechart',
  //         },
  //         {
  //             title: 'Chartjs',
  //             to: 'chart-chartjs',
  //         },
  //         {
  //             title: 'Sparkline',
  //             to: 'chart-sparkline',
  //         },
  //         {
  //             title: 'Apexchart',
  //             to: 'chart-apexchart',
  //         },
  //     ]
  // },
  //Boosttrap
  // {
  //     title: 'Bootstrap',
  //     classsChange: 'mm-collapse',
  //     iconStyle: <i className="fab fa-bootstrap"></i>,
  //     content: [
  //         {
  //             title: 'Accordion',
  //             to: 'ui-accordion',
  //         },
  //         {
  //             title: 'Alert',
  //             to: 'ui-alert',
  //         },
  //         {
  //             title: 'Badge',
  //             to: 'ui-badge',
  //         },
  //         {
  //             title: 'Button',
  //             to: 'ui-button',
  //         },
  //         {
  //             title: 'Modal',
  //             to: 'ui-modal',
  //         },
  //         {
  //             title: 'Button Group',
  //             to: 'ui-button-group',
  //         },
  //         {
  //             title: 'List Group',
  //             to: 'ui-list-group',
  //         },
  //         {
  //             title: 'Cards',
  //             to: 'ui-card',
  //         },
  //         {
  //             title: 'Carousel',
  //             to: 'ui-carousel',
  //         },
  //         {
  //             title: 'Dropdown',
  //             to: 'ui-dropdown',
  //         },
  //         {
  //             title: 'Popover',
  //             to: 'ui-popover',
  //         },
  //         {
  //             title: 'Progressbar',
  //             to: 'ui-progressbar',
  //         },
  //         {
  //             title: 'Tab',
  //             to: 'ui-tab',
  //         },
  //         {
  //             title: 'Typography',
  //             to: 'ui-typography',
  //         },
  //         {
  //             title: 'Pagination',
  //             to: 'ui-pagination',
  //         },
  //         {
  //             title: 'Grid',
  //             to: 'ui-grid',
  //         },
  //     ]
  // },
  //plugins
  // {
  //     title:'Plugins',
  //     classsChange: 'mm-collapse',
  //     iconStyle : <i className="fas fa-heart"></i>,
  //     content : [
  //         {
  //             title:'Select 2',
  //             to: 'uc-select2',
  //         },
  //         // {
  //         //     title:'Noui Slider',
  //         //     to: 'uc-noui-slider',
  //         // },
  //         {
  //             title:'Sweet Alert',
  //             to: 'uc-sweetalert',
  //         },
  //         {
  //             title:'Toastr',
  //             to: 'uc-toastr',
  //         },
  //         {
  //             title:'Jqv Map',
  //             to: 'map-jqvmap',
  //         },
  //         {
  //             title:'Light Gallery',
  //             to: 'uc-lightgallery',
  //         },
  //     ]
  // },
  //Widget
  // {
  //     title:'Widget',
  //     //classsChange: 'mm-collapse',
  //     iconStyle: <i className="fas fa-user-check"></i>,
  //     to: 'widget-basic',
  // },
  //Pages
  // {
  //     title:'Pages',
  //     classsChange: 'mm-collapse',
  //     iconStyle: <i className="fas fa-clone"></i>,
  //     content : [
  //         {
  //             title:'Error',
  //             hasMenu : true,
  //             content : [
  //                 {
  //                     title: 'Error 400',
  //                     to : 'page-error-400',
  //                 },
  //                 {
  //                     title: 'Error 403',
  //                     to : 'page-error-403',
  //                 },
  //                 {
  //                     title: 'Error 404',
  //                     to : 'page-error-404',
  //                 },
  //                 {
  //                     title: 'Error 500',
  //                     to : 'page-error-500',
  //                 },
  //                 {
  //                     title: 'Error 503',
  //                     to : 'page-error-503',
  //                 },
  //             ],
  //         },
  //         {
  //             title:'Lock Screen',
  //             to: 'page-lock-screen',
  //         },

  //     ]
  // },
  //Forms
  // {
  //     title:'Mail',
  //     classsChange: 'mm-collapse',
  //     iconStyle: <i className="fas fa-file-alt"></i>,
  //     content : [
  //         {
  //             title:'Form Elements',
  //             to: 'form-element',
  //         },
  //         {
  //             title:'Wizard',
  //             to: 'form-wizard',
  //         },
  //         {
  //             title:'CkEditor',
  //             to: 'form-ckeditor',
  //         },
  //         {
  //             title:'Pickers',
  //             to: 'form-pickers',
  //         },
  //         {
  //             title:'Form Validate',
  //             to: 'form-validation',
  //         },
  //     ]
  // },
];