function Btn(id) {
    if (!id) return {};
    this.$ele = $("#" + id);
    this._status = 0; // 0禁止 1可点, 2loading
  }
  Btn.prototype.setStatus = function(num) {
    switch (num) {
      case 0:
        // 禁止
        this._status = num;
        this.$ele.css({
          cursor: "not-allowed",
          "background-color": "#9EA2AC"
        });
        break;
      case 1:
        // 可点
        this._status = num;
        this.$ele.css({
          cursor: "pointer",
          "background-color": "#AEBF9F"
        });
        break;
      case 2:
        // loading
        this._status = num;
        this.$ele.css({
          "cursor": "progress",
          "background-color": "#9EA2AC"
        });
        break;
    }
  };
  Btn.prototype.disable = function() {
    this.setStatus(0);
    this.$ele.on('click', function() {
        $('#abnormal_tip').stop(true, true).text('! 请点击上传PDF文件').animate({display: 'toggle'}, 500);
    })
    return this;
  };
  Btn.prototype.clickable = function(cb) {
    this.setStatus(1);
    this.$ele.off().on('click', function () {
      cb();
    });
    return this;
  };
  Btn.prototype.ongoing = function() {
    this.setStatus(3);
    this.$ele.off();
    return this;
  };