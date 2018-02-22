Slingshot.createDirective("files", Slingshot.S3Storage, {
  bucket: "ardennenquiz",
  acl: "public-read",
  region: "eu-west-1",

  authorize: function() {
    return true;
  },

  key: function(file) {
    return `${new Date().getTime()}_${Math.round(Math.random() * 1000)}_${
      file.name
    }`;
  },
  allowedFileTypes: null,
  maxSize: 100 * 1024 * 1024 // 10 MB (use null for unlimited).
});
