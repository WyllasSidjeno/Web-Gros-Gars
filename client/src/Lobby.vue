<template>
  <div class = "game" v-bind:key="game" v-for="game in games">
    <!-- Insert a background for this div only using the change Icon -->
    <div class="name">{{ game.name }} </div>
    <div class="game-players">{{ game.nb }} / {{ game.max_users }} joueurs</div>
    <div class="game-level">Niveau : {{ game.level }}</div>
    <div class="game-join">
      <button @click="joinGame(game.id)" class="button">Rejoindre</button>
    </div>
  </div>
</template>

<script>
import {joinSiriusGame} from "./sirius-api";
export default {
  name: 'Lobby',
  data() {
    return {
      games: [],
    };
  },
  methods: {
    refreshGames(games){this.games = games;},
    joinGame(id){joinSiriusGame(id);},
    changeIcon(type){return `img/${type}.jpg`;},
  },
};
</script>