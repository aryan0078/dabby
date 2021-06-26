const { Structures } = require("discord.js");
const constants = require("@utils/constants");

module.exports = Structures.extend(
  "Pools",
  (Pools) =>
    class MiyakoUser extends Pools {
      get pools() {
        console.log(this.client.pools, "fff");
        return this.client.pools;
      }
      update(obj) {
        return this.client.settings[
          this.id === this.client.user.id ? "client" : "users"
        ].update(this.id, obj);
      }

      syncSettings() {
        return this.client.settings[
          this.id === this.client.user.id ? "client" : "users"
        ].sync(this.id);
      }

      /**
       * Sync only if the entry is not cached.
       */
      syncSettingsCache() {
        if (
          !this.client.settings[
            this.id === this.client.user.id ? "client" : "users"
          ].cache.has(this.id)
        ) {
          return this.syncSettings();
        }
      }
    }
);
