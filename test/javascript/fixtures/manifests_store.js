export const manifestStore = [
 {
   id:8,
   name:"manifest1",
   description:"private manifest",
   project:"labors",
   access:"private",
   data:{
     elements:[
        {
         name:"var1",
         description:"",
         script:"[1,2,3,4]"
        },
        {
         name:"var2",
         description:"",
         script:"'abc'"
        }
      ]
    },
   created_at:"2017-09-18T23:58:11.048Z",
   updated_at:"2017-09-18T23:58:11.048Z",
   user:{
     name:"Eurystheus"
    },
   is_editable:true
  },
  {
   id:9,
   name:"manifest2",
   description:"public manifest",
   project:"labors",
   access:"public",
   data:{
     elements:[
        {
         name:"var1",
         description:"",
         script:"'xyz'"
        },
        {
         name:"var2",
         description:"",
         script:"['1', 'abc', '4']"
        }
      ]
    },
   created_at:"2017-09-18T23:58:50.495Z",
   updated_at:"2017-09-18T23:58:50.495Z",
   user:{
     name:"Eurystheus"
    },
   is_editable:true
  },
  {
   id:10,
   name:"new_manifest",
   description:"new new",
   project:"labors",
   access:"private",
   data:{
     elements:[
        {
         name:"var",
         description:"",
         script:"'var'"
        }
      ]
    },
   created_at:"2017-09-19T00:11:12.260Z",
   updated_at:"2017-09-19T00:11:12.260Z",
   user:{
     name:"Eurystheus"
    },
   is_editable:true
  },
  {
   id:11,
   name:"manifest_for_plot",
   description:"for plot",
   project:"labors",
   access:"private",
   data:{
     elements:[
        {
         name:"var1",
         description:"",
         script:"[1,2,3,4]"
        },
        {
         name:"var2",
         description:"",
         script:"[1,2,3,4]"
        }
      ]
    },
   created_at:"2017-09-19T21:05:13.224Z",
   updated_at:"2017-09-19T21:05:13.224Z",
   user:{
     name:"Eurystheus"
    },
   is_editable:true
  }
];

export const manifest = {
  id:16,
  name: "NEW MANIFEST",
  access: "private",
  elementKeys: [
    "cf21b242-6748-473c-8254-a3b67014ae43",
    "db84f89b-29e2-4285-a2f4-9b24682a41d4"
  ],
  elementsByKey: {
    "cf21b242-6748-473c-8254-a3b67014ae43": {
      "name": "var",
      "description": "",
      "script": "123"
    },
    "db84f89b-29e2-4285-a2f4-9b24682a41d4": {
      "name": "var2",
      "description": "",
      "script": "'abc'"
    }
  },
  hasConsignment: false,
  description: "newest ",
  data: {
    "elements": [
      {
        "name": "var",
        "description": "",
        "script": "123"
      },
      {
        "name": "var2",
        "description": "",
        "script": "'abc'"
      }
    ]
  }
};
