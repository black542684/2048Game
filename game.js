
class Game {
  constructor (ctx, data) {
    this.ctx = ctx;
    this.data = data;
    this.init = {
      margin: 20,  // 边距
      top: 100,    // 距离顶部
      space: 16    // 小方块的间距
    };
    // 鼠标按下时候的坐标
    this.coordinate = {
      x: 0,
      y: 0
    };
    // 生成随机位置, 存放所有是0 的位置
    this.dots = [];
  }
  // 绘制背景
  drawBg () {
    this.ctx.fillStyle = '#BBADA0';
    this.ctx.fillRect(this.init.margin, this.init.top, canvas.width - this.init.margin * 2, canvas.width - this.init.margin * 2);
    // 绘制圆角边框
    this.ctx.strokeStyle = '#BBADA0';
    this.ctx.lineJoin = 'bevel'; // 圆角边框
    this.ctx.lineWidth = 10; // 宽度
    this.ctx.strokeRect(this.init.margin, this.init.top, canvas.width - this.init.margin * 2, canvas.width - this.init.margin * 2);
    this.ctx.fillStyle = '#BBADA0';
    this.ctx.fillRect(this.init.margin, this.init.top, canvas.width - this.init.margin * 2, canvas.width - this.init.margin * 2);
  }
  // 绘制小方块
  drawSquare () {
    // 计算小方块边长
    let edge = (canvas.width - this.init.margin * 2 - this.init.space * 5) / 4;
    let x = this.init.margin + this.init.space;
    let y = this.init.top + this.init.space;
    this.ctx.fillStyle = '#CDC1B4';
    this.data.forEach((row, rowIndex) => {
      row.forEach((column, columnIndex) => {
        this.ctx.fillStyle = '#CDC1B4';
        // if (column === 2) {
        //   this.ctx.fillStyle = '#EEE4DA';
        // }
        switch (column) {
          case 2 :
            this.ctx.fillStyle = '#EEE4DA';
            break;
          case 4:
            this.ctx.fillStyle = '#EDE0C8';
            break;
          case 8:
            this.ctx.fillStyle = '#F2B179';
            break;
          case 16:
            this.ctx.fillStyle = '#F59563';
            break;
          case 32:
            this.ctx.fillStyle = '#F67C5F';
            break;
          case 64:
            this.ctx.fillStyle = '#F65E3B';
            break;
          case 128:
            this.ctx.fillStyle = '#EDCF72';
            break;
          case 256:
            this.ctx.fillStyle = '#edcc61';
            break;
          case 512:
            this.ctx.fillStyle = '#9c0';
            break;
          case 1024:
            this.ctx.fillStyle = '#33b5e5';
            break;
          case 2048:
            this.ctx.fillStyle = '#09c';
            break;
        }
        this.ctx.fillRect(x + columnIndex * (edge + this.init.space), y + rowIndex * (edge + this.init.space), edge, edge);
        if (column > 0) {
          this.ctx.fillStyle = '#fff';
          this.ctx.font = '34px 微软雅黑';
          this.ctx.textAlign = 'center';
          this.ctx.fillText(column, x + columnIndex * (edge + this.init.space) + (edge / 2), y + rowIndex * (edge + this.init.space) + (edge / 1.5));
        }
      })
    });
  }
  // 监听滑动事件
  listen () {
    canvas.addEventListener('mousedown', (e) => {
      // 鼠标按下去
      this.coordinate.x = e.offsetX;
      this.coordinate.y = e.offsetY;
    });
    canvas.addEventListener('mouseup', (e) => {
      // 鼠标抬起
      let x = e.offsetX;
      let y = e.offsetY;
      let deltaX = x - this.coordinate.x;
      let deltaY = y - this.coordinate.y;
      // 判断滑动的距离是不是小于5， 如果小于5则不执行
      if (Math.abs(deltaX) < 10 && Math.abs(deltaY) < 10) {
        return ;
      }
      // 判断是横向移动还是纵向移动
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        // 横向移动
        if (deltaX > 0) {
          // 向右
          // 获取随机位置
          this.action();
          // 合并相同的
          this.rightAction();
        } else {
          // 获取随机位置
          this.action();
          // 合并相同的
          this.leftAction();
        }
      } else {
        // 纵向移动
        if (deltaY > 0) {
          // 向下
          // 获取随机位置
          this.action();
          // 合并相同
          this.downAction()
          console.log('down');
        } else {
          // 向上
          // 获取随机位置
          this.action();
          // 合并相同的
          this.upAction();
          console.log('up')
        }
      }
      // 重新绘制方块
      this.drawSquare();
    });
  }
  // 查找位置
  action () {
    this.dots = [];
    this.data.forEach((row, rowIndex) => {
      row.forEach((column, columnIndex) => {
        if (column === 0) {
          // 获取所有为 0 的位置
          let dot = [rowIndex, columnIndex];
          this.dots.push(dot);
        }
      })
    });
    // 判断this.dots 的长度是否为0， 如果是则游戏结束
    if (!this.dots.length) {
      // 通过弹出层提示游戏结束
      layer.msg('游戏结束！', {icon: 5});
      return ;
    }
    // 随机插入一个数字
    let index = Math.floor(Math.random() * this.dots.length);
    let newIndex = this.dots[index];
    // console.log(newIndex);
    this.data[newIndex[0]][newIndex[1]] = 2;
  }
  // 向左合并
  leftAction () {
    this.data.forEach(row => {
      // 合并相同的数字
      for (let i = 0; i < row.length - 1; i++) {
        for (let j = 1; j < row.length - i; j++) {
          if (row[i] !== 0 && row[i + j] !== 0) {
            if (row[i] === row[j+i]) {
              row[i] = row[i] * 2;
              row[j+i] = 0;
            }
          }
          break;
        }
      }
      
      
      // 整体向左移动
      for (let i = 0; i < row.length - 1; i++) {
        if (row[i] === 0) {
          // 如果数据为0 才能进行移动
          for (let j = 1; j < row.length - i; j++) {
            if (row[i + j] !== 0) {
              row[i] = row[j+i];
              row[j+i] = 0;
              break;
            }
          }
        }
      }
    });
  }
  // 向右合并
  rightAction () {
    this.data.forEach(row => {
      // 合并相同的数字
      // debugger
      for (let i = 3; i > 0; i--) {
        for (let j = i - 1; j >= 0 ; j--) {
          if (row[i] !== 0 && row[j] !== 0) {
            if (row[i] === row[j] ) {
              row[i] = row[i] * 2;
              row[j] = 0;
            }
          }
          break;
        }
      }
      
      
      // 整体向左移动
      
      for (let i = 3; i > 0; i--) {
        if (row[i] === 0) {
          // 如果数据为0 才能进行移动
          for (let j = i - 1; j >= 0 ; j--) {
            if (row[j] !== 0 && row[j]) {
              row[i] = row[j];
              row[j] = 0;
              break;
            }
          }
        }
      }
    });
  }
  // 向上合并
  upAction () {
    let data = this.data;
    // 合并相同的数字
      for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
          if (data[j][i] !== 0) {
            if (data[j + 1] && data[j][i] === data[j + 1][i]) {
              data[j][i] = data[j][i] * 2;
              data[j + 1][i] = 0;
              // break;
            }
          }
        }
      }
      // debugger
      // 整体向上移动
      for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
          if (data[j][i] === 0 ) {
            if (data[j+1] && data[j + 1][i] !== 0) {
            data[j][i] = data[j + 1][i]
            data[j+1][i] = 0;
            // break;
            i--;
            }
          }
        }
      }
    this.data = data;
  }
  // 向下合并
  downAction () {
    let data = this.data;
    // 合并相同的数字
      for (let i = 3; i >= 0; i--) {
        for (let j = 3; j >= 0; j--) {
          if (data[j][i] !== 0) {
            if (data[j - 1] && data[j][i] === data[j - 1][i]) {
              data[j][i] = data[j][i] * 2;
              data[j - 1][i] = 0;
              // break;
            }
          }
        }
      }
      // debugger
      // 整体向下移动
      for (let i = 3; i >= 0; i--) {
        for (let j = 3; j >= 0; j--) {
          if (data[j][i] === 0) {
            if (data[j -1] && data[j-1][i] !== 0) {
              data[j][i] = data[j -1][i];
              data[j -1][i] = 0;
              // break;
              i++;
            }
          }
        }
      }
    this.data = data;
  }
  // 初始化程序
  render () {
    // 绘制背景
    this.drawBg();
    // 绘制小方块
    this.drawSquare();
    // 监听滑动事件
    this.listen()
  }
}
