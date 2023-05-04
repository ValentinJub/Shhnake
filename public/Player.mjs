class Player {
  constructor({x, y, score, id}) {
    this.x = x;
    this.y = y;
    this.score = score;
    this.id = id;
  }

  movePlayer(dir, speed) {
    if (dir === 'right') {
      this.x += speed;
    } else if (dir === 'left') {
      this.x -= speed;
    } else if (dir === 'up') {
      this.y -= speed;
    } else if (dir === 'down') {
      this.y += speed;
    }
  }

  collision(item) {
    //should account for character size and collectible size
    return (this.x === item.x && this.y === item.y);
  }

  calculateRank(arr) {
     arr.sort((a, b ) => {
      return b.score - a.score;
     })
     return `Rank: ${arr.indexOf(this)+1} / ${arr.length}`;
  }
}

export default Player;
