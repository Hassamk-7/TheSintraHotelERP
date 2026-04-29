// vite.config.js
import { defineConfig } from "file:///F:/PMSHotelERP/HotelERP.Admin/node_modules/vite/dist/node/index.js";
import react from "file:///F:/PMSHotelERP/HotelERP.Admin/node_modules/@vitejs/plugin-react/dist/index.mjs";
var vite_config_default = defineConfig({
  plugins: [react()],
  base: "/admin/",
  publicDir: "public",
  build: {
    copyPublicDir: true
  },
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:5146",
        changeOrigin: true,
        secure: false
      },
      // Direct API endpoints without /api prefix
      "/Hotels": {
        target: "http://localhost:5146/api",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace("/Hotels", "/hotels")
      },
      "/Currency": {
        target: "http://localhost:5146/api",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace("/Currency", "/currency")
      },
      "/Suppliers": {
        target: "http://localhost:5146/api",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace("/Suppliers", "/suppliers")
      },
      "/GuestMaster": {
        target: "http://localhost:5146/api",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace("/GuestMaster", "/guestmaster")
      },
      "/RoomTypes": {
        target: "http://localhost:5146/api",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace("/RoomTypes", "/roomtypes")
      }
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJGOlxcXFxQTVNIb3RlbEVSUFxcXFxIb3RlbEVSUC5BZG1pblwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiRjpcXFxcUE1TSG90ZWxFUlBcXFxcSG90ZWxFUlAuQWRtaW5cXFxcdml0ZS5jb25maWcuanNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0Y6L1BNU0hvdGVsRVJQL0hvdGVsRVJQLkFkbWluL3ZpdGUuY29uZmlnLmpzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSdcbmltcG9ydCByZWFjdCBmcm9tICdAdml0ZWpzL3BsdWdpbi1yZWFjdCdcblxuLy8gaHR0cHM6Ly92aXRlLmRldi9jb25maWcvXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuICBwbHVnaW5zOiBbcmVhY3QoKV0sXG4gIGJhc2U6ICcvYWRtaW4vJyxcbiAgcHVibGljRGlyOiAncHVibGljJyxcbiAgYnVpbGQ6IHtcbiAgICBjb3B5UHVibGljRGlyOiB0cnVlXG4gIH0sXG4gIHNlcnZlcjoge1xuICAgIHByb3h5OiB7XG4gICAgICAnL2FwaSc6IHtcbiAgICAgICAgdGFyZ2V0OiAnaHR0cDovL2xvY2FsaG9zdDo1MTQ2JyxcbiAgICAgICAgY2hhbmdlT3JpZ2luOiB0cnVlLFxuICAgICAgICBzZWN1cmU6IGZhbHNlLFxuICAgICAgfSxcbiAgICAgIC8vIERpcmVjdCBBUEkgZW5kcG9pbnRzIHdpdGhvdXQgL2FwaSBwcmVmaXhcbiAgICAgICcvSG90ZWxzJzoge1xuICAgICAgICB0YXJnZXQ6ICdodHRwOi8vbG9jYWxob3N0OjUxNDYvYXBpJyxcbiAgICAgICAgY2hhbmdlT3JpZ2luOiB0cnVlLFxuICAgICAgICBzZWN1cmU6IGZhbHNlLFxuICAgICAgICByZXdyaXRlOiAocGF0aCkgPT4gcGF0aC5yZXBsYWNlKCcvSG90ZWxzJywgJy9ob3RlbHMnKVxuICAgICAgfSxcbiAgICAgICcvQ3VycmVuY3knOiB7XG4gICAgICAgIHRhcmdldDogJ2h0dHA6Ly9sb2NhbGhvc3Q6NTE0Ni9hcGknLFxuICAgICAgICBjaGFuZ2VPcmlnaW46IHRydWUsXG4gICAgICAgIHNlY3VyZTogZmFsc2UsXG4gICAgICAgIHJld3JpdGU6IChwYXRoKSA9PiBwYXRoLnJlcGxhY2UoJy9DdXJyZW5jeScsICcvY3VycmVuY3knKVxuICAgICAgfSxcbiAgICAgICcvU3VwcGxpZXJzJzoge1xuICAgICAgICB0YXJnZXQ6ICdodHRwOi8vbG9jYWxob3N0OjUxNDYvYXBpJyxcbiAgICAgICAgY2hhbmdlT3JpZ2luOiB0cnVlLFxuICAgICAgICBzZWN1cmU6IGZhbHNlLFxuICAgICAgICByZXdyaXRlOiAocGF0aCkgPT4gcGF0aC5yZXBsYWNlKCcvU3VwcGxpZXJzJywgJy9zdXBwbGllcnMnKVxuICAgICAgfSxcbiAgICAgICcvR3Vlc3RNYXN0ZXInOiB7XG4gICAgICAgIHRhcmdldDogJ2h0dHA6Ly9sb2NhbGhvc3Q6NTE0Ni9hcGknLFxuICAgICAgICBjaGFuZ2VPcmlnaW46IHRydWUsXG4gICAgICAgIHNlY3VyZTogZmFsc2UsXG4gICAgICAgIHJld3JpdGU6IChwYXRoKSA9PiBwYXRoLnJlcGxhY2UoJy9HdWVzdE1hc3RlcicsICcvZ3Vlc3RtYXN0ZXInKVxuICAgICAgfSxcbiAgICAgICcvUm9vbVR5cGVzJzoge1xuICAgICAgICB0YXJnZXQ6ICdodHRwOi8vbG9jYWxob3N0OjUxNDYvYXBpJyxcbiAgICAgICAgY2hhbmdlT3JpZ2luOiB0cnVlLFxuICAgICAgICBzZWN1cmU6IGZhbHNlLFxuICAgICAgICByZXdyaXRlOiAocGF0aCkgPT4gcGF0aC5yZXBsYWNlKCcvUm9vbVR5cGVzJywgJy9yb29tdHlwZXMnKVxuICAgICAgfVxuICAgIH1cbiAgfVxufSlcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBK1EsU0FBUyxvQkFBb0I7QUFDNVMsT0FBTyxXQUFXO0FBR2xCLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCLFNBQVMsQ0FBQyxNQUFNLENBQUM7QUFBQSxFQUNqQixNQUFNO0FBQUEsRUFDTixXQUFXO0FBQUEsRUFDWCxPQUFPO0FBQUEsSUFDTCxlQUFlO0FBQUEsRUFDakI7QUFBQSxFQUNBLFFBQVE7QUFBQSxJQUNOLE9BQU87QUFBQSxNQUNMLFFBQVE7QUFBQSxRQUNOLFFBQVE7QUFBQSxRQUNSLGNBQWM7QUFBQSxRQUNkLFFBQVE7QUFBQSxNQUNWO0FBQUE7QUFBQSxNQUVBLFdBQVc7QUFBQSxRQUNULFFBQVE7QUFBQSxRQUNSLGNBQWM7QUFBQSxRQUNkLFFBQVE7QUFBQSxRQUNSLFNBQVMsQ0FBQyxTQUFTLEtBQUssUUFBUSxXQUFXLFNBQVM7QUFBQSxNQUN0RDtBQUFBLE1BQ0EsYUFBYTtBQUFBLFFBQ1gsUUFBUTtBQUFBLFFBQ1IsY0FBYztBQUFBLFFBQ2QsUUFBUTtBQUFBLFFBQ1IsU0FBUyxDQUFDLFNBQVMsS0FBSyxRQUFRLGFBQWEsV0FBVztBQUFBLE1BQzFEO0FBQUEsTUFDQSxjQUFjO0FBQUEsUUFDWixRQUFRO0FBQUEsUUFDUixjQUFjO0FBQUEsUUFDZCxRQUFRO0FBQUEsUUFDUixTQUFTLENBQUMsU0FBUyxLQUFLLFFBQVEsY0FBYyxZQUFZO0FBQUEsTUFDNUQ7QUFBQSxNQUNBLGdCQUFnQjtBQUFBLFFBQ2QsUUFBUTtBQUFBLFFBQ1IsY0FBYztBQUFBLFFBQ2QsUUFBUTtBQUFBLFFBQ1IsU0FBUyxDQUFDLFNBQVMsS0FBSyxRQUFRLGdCQUFnQixjQUFjO0FBQUEsTUFDaEU7QUFBQSxNQUNBLGNBQWM7QUFBQSxRQUNaLFFBQVE7QUFBQSxRQUNSLGNBQWM7QUFBQSxRQUNkLFFBQVE7QUFBQSxRQUNSLFNBQVMsQ0FBQyxTQUFTLEtBQUssUUFBUSxjQUFjLFlBQVk7QUFBQSxNQUM1RDtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
