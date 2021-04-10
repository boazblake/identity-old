// See http://brunch.io for documentation.
exports.files = {
  javascripts: {
    joinTo: {
      "vendor.js": /^(?!app)/, // Files that are not in `app` dir.
      "app.js": /^app/,
    },
  },
  stylesheets: {
    order: {
      before: ["normalize.css"],
      after: ["app.css"],
    },
    joinTo: {
      "app.css": [
        (path) => path.includes(".scss"),
        (path) => path.includes(".css"),
        (path) => path.includes(".sass"),
      ],
    },
  },
}

exports.modules = {
  autoRequire: {
    "app.js": ["initialize"],
  },
}

exports.plugins = {
  sass: {
    precision: 8,
    mode: "native",
    sourceMapEmbed: true,
    includePaths: [],
  },
  imagemin: {
    plugins: {
      "imagemin-gifsicle": true,
      "imagemin-jpegtran": true,
      "imagemin-optipng": true,
      "imagemin-svgo": true,
    },
    pattern: /\.(gif|jpg|jpeg|jpe|jif|jfif|jfi|png|svg|svgz)$/,
  },
  babel: {
    presets: [
      [
        "@babel/preset-env",
        {
          targets: {
            browsers: ["last 2 versions"],
          },
        },
      ],
    ],
  },
  copycat: {
    // fonts: [
    //   "node_modules/@mithril-icons/clarity/cjs"
    //   "bower_components/material-design-iconic-font",
    //   "bower_components/font-awesome/fonts"
    // ],
    images: ["app/assets/images", "app/assets/files"],
    verbose: true, //shows each file that is copied to the destination directory
    onlyChanged: true, //only copy a file if it's modified time has changed (only effective when using brunch watch)
  },
  "@babel": { presets: ["env"] },
  terser: {
    mangle: true,
    compress: {
      global_defs: {
        DEBUG: false,
      },
    },
  },
}

exports.paths = {
  public: "docs",
  watched: [
    "app",
    "app/utils",
    "app/components",
    "app/styles",
    "app/pages",
    "app/assets",
  ],
}

exports.npm = {
  enabled: true,
  globals: { m: "mithril" },
  styles: {
    "normalize.css": ["normalize.css"],
  },
}
