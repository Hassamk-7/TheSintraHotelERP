// vite.config.js
import { defineConfig } from "file:///E:/HotelERP/HotelERP.Frontend/node_modules/vite/dist/node/index.js";
import react from "file:///E:/HotelERP/HotelERP.Frontend/node_modules/@vitejs/plugin-react/dist/index.mjs";
var vite_config_default = defineConfig({
  plugins: [react()],
  base: "/admin/",
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJFOlxcXFxIb3RlbEVSUFxcXFxIb3RlbEVSUC5Gcm9udGVuZFwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiRTpcXFxcSG90ZWxFUlBcXFxcSG90ZWxFUlAuRnJvbnRlbmRcXFxcdml0ZS5jb25maWcuanNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0U6L0hvdGVsRVJQL0hvdGVsRVJQLkZyb250ZW5kL3ZpdGUuY29uZmlnLmpzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSdcbmltcG9ydCByZWFjdCBmcm9tICdAdml0ZWpzL3BsdWdpbi1yZWFjdCdcblxuLy8gaHR0cHM6Ly92aXRlLmRldi9jb25maWcvXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuICBwbHVnaW5zOiBbcmVhY3QoKV0sXG4gIGJhc2U6ICcvYWRtaW4vJyxcbiAgc2VydmVyOiB7XG4gICAgcHJveHk6IHtcbiAgICAgICcvYXBpJzoge1xuICAgICAgICB0YXJnZXQ6ICdodHRwOi8vbG9jYWxob3N0OjUxNDYnLFxuICAgICAgICBjaGFuZ2VPcmlnaW46IHRydWUsXG4gICAgICAgIHNlY3VyZTogZmFsc2UsXG4gICAgICB9LFxuICAgICAgLy8gRGlyZWN0IEFQSSBlbmRwb2ludHMgd2l0aG91dCAvYXBpIHByZWZpeFxuICAgICAgJy9Ib3RlbHMnOiB7XG4gICAgICAgIHRhcmdldDogJ2h0dHA6Ly9sb2NhbGhvc3Q6NTE0Ni9hcGknLFxuICAgICAgICBjaGFuZ2VPcmlnaW46IHRydWUsXG4gICAgICAgIHNlY3VyZTogZmFsc2UsXG4gICAgICAgIHJld3JpdGU6IChwYXRoKSA9PiBwYXRoLnJlcGxhY2UoJy9Ib3RlbHMnLCAnL2hvdGVscycpXG4gICAgICB9LFxuICAgICAgJy9DdXJyZW5jeSc6IHtcbiAgICAgICAgdGFyZ2V0OiAnaHR0cDovL2xvY2FsaG9zdDo1MTQ2L2FwaScsXG4gICAgICAgIGNoYW5nZU9yaWdpbjogdHJ1ZSxcbiAgICAgICAgc2VjdXJlOiBmYWxzZSxcbiAgICAgICAgcmV3cml0ZTogKHBhdGgpID0+IHBhdGgucmVwbGFjZSgnL0N1cnJlbmN5JywgJy9jdXJyZW5jeScpXG4gICAgICB9LFxuICAgICAgJy9TdXBwbGllcnMnOiB7XG4gICAgICAgIHRhcmdldDogJ2h0dHA6Ly9sb2NhbGhvc3Q6NTE0Ni9hcGknLFxuICAgICAgICBjaGFuZ2VPcmlnaW46IHRydWUsXG4gICAgICAgIHNlY3VyZTogZmFsc2UsXG4gICAgICAgIHJld3JpdGU6IChwYXRoKSA9PiBwYXRoLnJlcGxhY2UoJy9TdXBwbGllcnMnLCAnL3N1cHBsaWVycycpXG4gICAgICB9LFxuICAgICAgJy9HdWVzdE1hc3Rlcic6IHtcbiAgICAgICAgdGFyZ2V0OiAnaHR0cDovL2xvY2FsaG9zdDo1MTQ2L2FwaScsXG4gICAgICAgIGNoYW5nZU9yaWdpbjogdHJ1ZSxcbiAgICAgICAgc2VjdXJlOiBmYWxzZSxcbiAgICAgICAgcmV3cml0ZTogKHBhdGgpID0+IHBhdGgucmVwbGFjZSgnL0d1ZXN0TWFzdGVyJywgJy9ndWVzdG1hc3RlcicpXG4gICAgICB9LFxuICAgICAgJy9Sb29tVHlwZXMnOiB7XG4gICAgICAgIHRhcmdldDogJ2h0dHA6Ly9sb2NhbGhvc3Q6NTE0Ni9hcGknLFxuICAgICAgICBjaGFuZ2VPcmlnaW46IHRydWUsXG4gICAgICAgIHNlY3VyZTogZmFsc2UsXG4gICAgICAgIHJld3JpdGU6IChwYXRoKSA9PiBwYXRoLnJlcGxhY2UoJy9Sb29tVHlwZXMnLCAnL3Jvb210eXBlcycpXG4gICAgICB9XG4gICAgfVxuICB9XG59KVxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUErUSxTQUFTLG9CQUFvQjtBQUM1UyxPQUFPLFdBQVc7QUFHbEIsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsU0FBUyxDQUFDLE1BQU0sQ0FBQztBQUFBLEVBQ2pCLE1BQU07QUFBQSxFQUNOLFFBQVE7QUFBQSxJQUNOLE9BQU87QUFBQSxNQUNMLFFBQVE7QUFBQSxRQUNOLFFBQVE7QUFBQSxRQUNSLGNBQWM7QUFBQSxRQUNkLFFBQVE7QUFBQSxNQUNWO0FBQUE7QUFBQSxNQUVBLFdBQVc7QUFBQSxRQUNULFFBQVE7QUFBQSxRQUNSLGNBQWM7QUFBQSxRQUNkLFFBQVE7QUFBQSxRQUNSLFNBQVMsQ0FBQyxTQUFTLEtBQUssUUFBUSxXQUFXLFNBQVM7QUFBQSxNQUN0RDtBQUFBLE1BQ0EsYUFBYTtBQUFBLFFBQ1gsUUFBUTtBQUFBLFFBQ1IsY0FBYztBQUFBLFFBQ2QsUUFBUTtBQUFBLFFBQ1IsU0FBUyxDQUFDLFNBQVMsS0FBSyxRQUFRLGFBQWEsV0FBVztBQUFBLE1BQzFEO0FBQUEsTUFDQSxjQUFjO0FBQUEsUUFDWixRQUFRO0FBQUEsUUFDUixjQUFjO0FBQUEsUUFDZCxRQUFRO0FBQUEsUUFDUixTQUFTLENBQUMsU0FBUyxLQUFLLFFBQVEsY0FBYyxZQUFZO0FBQUEsTUFDNUQ7QUFBQSxNQUNBLGdCQUFnQjtBQUFBLFFBQ2QsUUFBUTtBQUFBLFFBQ1IsY0FBYztBQUFBLFFBQ2QsUUFBUTtBQUFBLFFBQ1IsU0FBUyxDQUFDLFNBQVMsS0FBSyxRQUFRLGdCQUFnQixjQUFjO0FBQUEsTUFDaEU7QUFBQSxNQUNBLGNBQWM7QUFBQSxRQUNaLFFBQVE7QUFBQSxRQUNSLGNBQWM7QUFBQSxRQUNkLFFBQVE7QUFBQSxRQUNSLFNBQVMsQ0FBQyxTQUFTLEtBQUssUUFBUSxjQUFjLFlBQVk7QUFBQSxNQUM1RDtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
