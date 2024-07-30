<template>
  <div class="dashboard">
    <v-app>
      <v-navigation-drawer
        v-model="drawer"
        app
        clipped
        fixed
        width="300"
        class="sidebar"
      >
        <v-list dense>
          <v-list-item
            class="d-flex"
            v-for="(item, index) in menuItems"
            :key="index"
            :to="item.route"
            link
          >
            <v-list-item-icon>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>{{ item.title }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-navigation-drawer>

      <v-app-bar app clipped-left>
        <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
        <v-toolbar-title>Admin Panel</v-toolbar-title>
      </v-app-bar>

      <v-main>
        <v-container fluid>
          <router-view></router-view>
        </v-container>
      </v-main>
    </v-app>
  </div>
</template>

<script>
export default {
  name: 'CabinetLayout',
  data() {
    return {
      drawer: false,
      menuItems: [
        {
          title: 'Api Ключи',
          icon: 'mdi-archive',
          route: { name: 'cabinet-api-keys' },
        },
        {
          title: 'Аккаунты',
          icon: 'mdi-package-variant',
          route: { name: 'cabinet-accounts' },
        },
      ],
    };
  },
};
</script>

<style scoped lang="scss">
.dashboard {
  display: flex;
  height: 100vh;
}

.sidebar {
  background-color: #2c3e50;
  padding: 20px;
  color: white;

  a {
    display: flex;
    align-items: center;
    padding: 10px 0;
    color: white;
    text-decoration: none;
  }
}

.sidebar a i {
  margin-right: 10px;
}

.sidebar a:hover {
  background-color: #34495e;
}

.content {
  padding: 20px;
}

.v-list-item__content {
  display: flex;
  align-items: center;
}

/* Mobile Styles */
@media (max-width: 768px) {
  .dashboard {
    flex-direction: column;
  }

  .sidebar {
    padding: 10px;
  }

  .content {
    padding: 10px;
  }
}
</style>
