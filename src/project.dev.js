require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"ActionHelper":[function(require,module,exports){
"use strict";
cc._RFpush(module, '8c23bt/1nFOJZ1FQQh6jGt2', 'ActionHelper');
// Script\Util\ActionHelper.js

/* ---------------------------------------------------------------
 *  动作帮助类
 * ---------------------------------------------------------------
 */
var ActionHelper = cc.Class({
    // 创建循环动作
    createLoopAction: function createLoopAction(times, action) {
        if (times < 0) {
            return cc.repeatForever(action);
        } else {
            return cc.repeat(action, times);
        }
    },

    // 反复缩放
    createScaleAction: function createScaleAction(cd, x1, y1, x2, y2) {
        var scaleBig = cc.scaleTo(cd, x1, y1);
        var scaleSmall = cc.scaleTo(cd, x2, y2);
        var seq = cc.sequence(scaleBig, scaleSmall);
        return seq;
    },

    // 反复位移
    createMoveAction: function createMoveAction(cd, x, y) {
        var move1 = cc.moveTo(cd, cc.p(x, y));
        var move2 = cc.moveTo(cd, cc.p(0, 0));
        var move3 = cc.moveTo(cd, cc.p(-x, -y));
        var seq = cc.sequence(move1, move2, move3, move2);
        return seq;
    },

    // 摇摆动作
    createRotateAction: function createRotateAction(cd, x, y) {
        var rotate1 = cc.rotateTo(cd, x, y);
        var rotate2 = cc.rotateTo(cd, 0, 0);
        var rotate3 = cc.rotateTo(cd, -x, -y);
        var seq = cc.sequence(rotate1, rotate2, rotate3, rotate2);
        return seq;
    }
});

module.exports = ActionHelper;

cc._RFpop();
},{}],"BattleBubble":[function(require,module,exports){
"use strict";
cc._RFpush(module, '4ac17NQDRJO+ocJg/JPIq9G', 'BattleBubble');
// Script\Battle\BattleBubble.js

cc.Class({
    "extends": cc.Component,

    properties: {
        // foo: {
        //    default: null,      // The default value will be used only when the component attaching
        //                           to a node for the first time
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
    },

    // use this for initialization
    onLoad: function onLoad() {}

});
// called every frame, uncomment this function to activate update callback
// update: function (dt) {

// },

cc._RFpop();
},{}],"BattleBuffManager":[function(require,module,exports){
"use strict";
cc._RFpush(module, '14046lHZphFIbirvkDt7VyO', 'BattleBuffManager');
// Script\Battle\BattleBuffManager.js

/**buff管理脚本 */
cc.Class({
    'extends': cc.Component,
    properties: {},
    // use this for initialization
    onLoad: function onLoad() {
        this.buffStatusArray = new Array();
    },

    ///添加buff
    addBuff: function addBuff(buff_id) {
        var csvstatus = window.csv.get('status_csv', buff_id);
        var type = csvstatus.get('type');
        var time = csvstatus.get('time') / 1000;
        var max_time = csvstatus.get('max_time') / 1000;
        var interval = csvstatus.get('interval') / 1000;
        var changeValue = csvstatus.get('value');
        var percentage = csvstatus.get('percentage') / 10000;
        var buffStatus = null;
        buffStatus = this.getBuffByType(type);
        if (!buffStatus) {
            buffStatus = {
                cfgStatus: csvstatus,
                buff_id: buff_id,
                type: type,
                time: time, //持续时间
                max_time: max_time, //最大时间
                interval: interval, //间隔时间
                changeValue: changeValue, //变化值
                changePercentage: percentage
            };
            this.buffStatusArray.push(buffStatus);
        } else {
            buffStatus.cfgStatus = csvstatus;
            buffStatus.buff_id = buff_id;
            buffStatus.type = type;
            buffStatus.time = time;
            buffStatus.max_time = max_time;
            buffStatus.interval = interval;
            buffStatus.changeValue = changeValue;
        }
    },

    ///获取buff
    getBuffByType: function getBuffByType(type) {
        for (var i in this.buffStatusArray) {
            var buff = this.buffStatusArray[i];
            if (buff.type === type) {
                return buff;
            }
        }
        return null;
    },

    ///检测buff
    checkBuff: function checkBuff() {},

    ///buff生效
    effectBuff: function effectBuff() {
        //生效
    },

    ////buff结束
    endBuff: function endBuff() {
        //失效
    },

    // called every frame, uncomment this function to activate update callback
    update: function update(dt) {
        for (var i in this.buffStatusArray) {
            var buff = this.buffStatusArray[i];
            if (buff.time > 0) {
                buff.time -= dt;
                if (buff.time < 0) {
                    this.endBuff();
                }
            }
        }
    }
});

cc._RFpop();
},{}],"BattleChild":[function(require,module,exports){
"use strict";
cc._RFpush(module, '15a23PAs8xIMq/sZbOSVLGo', 'BattleChild');
// Script\Battle\BattleChild.js

/*小弟逻辑管理 */
var TypesHelper = null;
var ActionHelper = null;
var CsvHelper = null;
cc.Class({
    'extends': cc.Component,
    properties: {
        targetPlayer: cc.Node
    },

    // 移动到指定的目标
    moveToTarget: function moveToTarget(pos) {
        this.moveToPos = pos;
        this.isMoving = true;
        var oldPos = this.node.position;
        var dis = Math.abs(cc.pDistance(oldPos, this.moveToPos));
        this.moveTime = dis / this.Data.Speed;
    },

    ///初始化 战斗信息
    initBattleData: function initBattleData() {
        //hp, speed, attack, defence, attackRange
        var csvsoldier = this.Data.CfgSolider;
        ///血量百分比
        var hpPercent = csvsoldier.get('per_output') / 10000;
        ///攻击百分比
        var attackPercent = csvsoldier.get('per_attack') / 10000;
        ///防御百分比
        var defencePercent = csvsoldier.get('per_defense') / 10000;
        ///
        //cc.log('attackPercent:', attackPercent );
        //血量
        var hp = this.owner.getComponent('BattleUnitDataManager').battleData.hp * hpPercent;
        //攻击
        var attack = this.owner.getComponent('BattleUnitDataManager').battleData.attack * attackPercent;
        //防御
        var defence = this.owner.getComponent('BattleUnitDataManager').battleData.defence * defencePercent;
        //攻击范围
        var attackRange = this.Data.WarningRange;
        //速度
        var speed = this.Data.Speed;
        //初始化 战斗数据
        this.getComponent('BattleUnitDataManager').initData(hp, 0, attack, defence, attackRange, TypesHelper.BattleUnitTypes.Child, this, true);
        this.getComponent('BattleUnitDataManager').setOwner(this.owner);
    },

    // 初始化资源
    initData: function initData() {
        TypesHelper = window.types;
        ActionHelper = window.actionHelper;
        CsvHelper = window.csv;
        var chars = [3001, 3011, 3021];
        var id = Math.floor(Math.random() * 3);
        var csvsoldier = CsvHelper.get('soldier_csv', chars[id]);
        var cfgMonster = CsvHelper.get('monster_csv', csvsoldier.get('monster_id'));
        var self = this;
        this.moveToPos = cc.p(0, 0);
        this.isMoving = false;
        ///是否被激活
        this.isActive = false;
        this.moveTime = 0;
        ///随机位移的时间间隔
        this.movePosRandomCD = 0;
        //切换目标的时间间隔
        this.changeTargetCD = 0;
        this.movePosRandomPos = cc.p(0, 0);
        this.targetEnemy = null;
        this.isDead = false;
        this.Data = {};
        ///行走速度
        this.Data.Speed = cfgMonster.get('speed');
        this.Data.Speed += cc.random0To1() * 80;
        ///所需统帅值
        this.Data.NeedCommander = csvsoldier.get('need_commander');
        ///警戒范围
        this.Data.WarningRange = cfgMonster.get('warning_range');
        ///基础信息配置
        this.Data.CfgSolider = csvsoldier;

        //cc.log('skillid:', csvsoldier.get('monster_id'), cfgMonster);
        this.getComponent('BattleSkillManager').initData(this);
        this.getComponent('BattleSkillManager').putSkill(cfgMonster.get('attack_skillid'));

        ///初始状态
        this.Status = TypesHelper.BattleChildStatus.Stop;
        var speed = this.Data.Speed;
        this.getComponent('BattleMoveManager').initData(speed, TypesHelper.BattleMoveStatus.Stop, false, null, cc.p(0, 0));
        this.getComponent('BattleContactManager').init(TypesHelper.BattleContactTypes.Player, this, true);

        /*
        ///纹理切换
        cc.loader.loadRes("battle/mercenary", cc.SpriteAtlas, function (err, atlas) {
            let png = cfgMonster.get('resource_name');
            cc.log('path:', png );
            let frame = atlas.getSpriteFrame( png );
            var sprite = self.node.getChildByName('sprite');
            sprite.getComponent( cc.Sprite ).spriteFrame = frame;
        });
        */
        var clip_path = "111clip/" + cfgMonster.get('resource_name');
        ///纹理切换
        var sprite = self.node.getChildByName('sprite');
        cc.loader.loadRes(clip_path, cc.AnimationClip, function (err, clip) {
            sprite.getComponent(cc.Animation).addClip(clip, 'run');
            sprite.getComponent(cc.Animation).play('run');
        });
        ///
        cc.loader.loadRes("111clip/Attack", cc.AnimationClip, function (err, clip) {
            sprite.getComponent(cc.Animation).addClip(clip, 'attack');
        });

        //animation.on('finished',  this.onFinish,  this);

        if (!this.owner) {
            this.owner = null;
        } else {
            this.setParent(this.owner);
        }
    },

    onFinish: function onFinish() {
        //cc.log('damagefinish........');
        this.poolManager.put(this.node);
    },

    // use this for initialization
    onLoad: function onLoad() {
        this.initData();

        var scaleAction = ActionHelper.createLoopAction(-1, ActionHelper.createScaleAction(0.2, 1.1, 1.1, 0.9, 0.9));
        this.node.runAction(scaleAction);

        var rotateAction = ActionHelper.createLoopAction(-1, ActionHelper.createRotateAction(0.3, 15, 15));
        this.node.runAction(rotateAction);

        var sprite = this.node.getChildByName('sprite');
        var moveAction = ActionHelper.createLoopAction(-1, ActionHelper.createMoveAction(0.25, 15, 0));
        if (sprite) {
            sprite.runAction(moveAction);
        }
    },

    // called every frame, uncomment this function to activate update callback
    update: function update(dt) {
        var zorder = 1920 - this.node.getPosition().y;
        this.node.setLocalZOrder(zorder);
    },

    ///受伤
    hurt: function hurt(damage) {},

    ///攻击
    attack: function attack() {
        var sprite = this.node.getChildByName('sprite');
        sprite.getComponent(cc.Animation).playAdditive('attack');
    },

    ///死亡
    dead: function dead() {
        this.targetPlayer.getComponent('BattlePlayer').updateCommander(-this.Data.NeedCommander);
    },

    ///找到敌方单位
    findEnemy: function findEnemy(target) {},

    ///离开敌方单位
    outOfEnemy: function outOfEnemy() {},

    setParent: function setParent(target) {
        this.Status = TypesHelper.BattleChildStatus.Foloow;
        this.isActive = true;
        this.owner = target;
        // 使用给定的模板在场景中生成一个新节点
        var radius = cc.random0To1() * 360 * 0.017453293;
        var sinx = Math.sin(radius);
        var cosx = Math.cos(radius);
        var a = 30;
        var b = 50;
        var x = b * sinx;
        var y = a * cosx;
        this.ownerPos = cc.p(x, y);
        window.battleMain.createNewChild();
        //初始化 运动状态
        var speed = this.Data.Speed;
        this.getComponent('BattleMoveManager').initData(speed, TypesHelper.BattleMoveStatus.FoloowGroup, false, this.owner, this.ownerPos);
        this.initBattleData();
        target.getComponent('BattlePlayer').putChild(this.node);
        target.getComponent('BattlePlayer').updateCommander(this.Data.NeedCommander);
        this.getComponent('BattleContactManager').isActive = false;
    },

    contact: function contact(target) {
        var need_commander = this.Data.NeedCommander;
        ///检测统帅值
        if (target.getComponent('BattlePlayer').checkCommander(need_commander)) {
            this.node.getChildByName('BattleBubble').getComponent(cc.Animation).play('Bubble');
            target.getChildByName('BattleBubble').getComponent(cc.Animation).play('Bubble');
            this.setParent(target);
        }
    }
});

cc._RFpop();
},{}],"BattleContactManager":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'e992bC+X65KHb9odAhRtfxn', 'BattleContactManager');
// Script\Battle\BattleContactManager.js

///触碰管理脚本
var TypesHelper = null;
cc.Class({
    'extends': cc.Component,
    properties: {
        //触碰范围
        contactRange: 0
    },

    // use this for initialization
    onLoad: function onLoad() {},

    init: function init(contactType, mainComponent, isActive) {
        TypesHelper = window.types;
        this.contactType = contactType; //TypesHelper.BattleContactTypes.Player;
        this.isActive = isActive;
        this.mainComponent = mainComponent;
    },

    ///是否触碰到玩家
    _checkIsContactPlayer: function _checkIsContactPlayer() {
        for (var i in window.battleMain.getComponent('BattleMain').battleUnitArray) {
            var battleUnit = window.battleMain.getComponent('BattleMain').battleUnitArray[i];

            if (battleUnit === this.node) {
                continue;
            }

            var battleData = battleUnit.getComponent('BattleUnitDataManager');
            var unitType = battleData.unitType;

            if (this.contactType === TypesHelper.BattleContactTypes.Player && unitType != TypesHelper.BattleUnitTypes.Player || this.contactType === TypesHelper.BattleContactTypes.Child && unitType != TypesHelper.BattleUnitTypes.Child || this.contactType === TypesHelper.BattleContactTypes.All && unitType != TypesHelper.BattleUnitTypes.Child && unitType != TypesHelper.BattleUnitTypes.Player) {
                continue;
            }

            var group = battleData.GroupIndex;
            var isActive = battleData.isActive;
            var my_group = this.getComponent('BattleUnitDataManager').GroupIndex;
            ///和我同一组 或者 非激活状态
            if ( /*group === my_group ||*/!isActive) {
                continue;
            }

            var pos = battleUnit.getPosition();
            var dis = cc.pDistance(this.node.getPosition(), pos);
            if (dis < this.contactRange) {
                return battleUnit;
            }
        }
        return null;
    },

    update: function update() {

        if (this.isActive) {
            var target = this._checkIsContactPlayer();
            if (target) {
                this.mainComponent.contact(target);
            }
        }
    }

});

cc._RFpop();
},{}],"BattleCtrl":[function(require,module,exports){
"use strict";
cc._RFpush(module, '646f9cCEZtJ/LJwFgWnoMwW', 'BattleCtrl');
// Script\Battle\BattleCtrl.js

//const i18n = require('i18n');

cc.Class({
    'extends': cc.Component,

    properties: {
        ButtonSpeed: {
            'default': null,
            type: cc.Node
        }
    },

    //
    onBtnSpeedClicked: function onBtnSpeedClicked() {
        //cc.log('Left button clicked!......................', this.node.getName() );
        var label_title = this.ButtonSpeed.getChildByName('label_title');
        var player = this.getComponent('BattleMain').player;
        if (player.GroupTypeIsFree) {
            player.GroupTypeIsFree = false;
            label_title.getComponent(cc.Label).string = '分散';
        } else {
            player.GroupTypeIsFree = true;
            label_title.getComponent(cc.Label).string = '集合';
        }
    },

    // use this for initialization
    onLoad: function onLoad() {}

});
// called every frame, uncomment this function to activate update callback
// update: function (dt) {

// },

cc._RFpop();
},{}],"BattleDrop":[function(require,module,exports){
"use strict";
cc._RFpush(module, '43dcfsBUKNBBZUFF8J1sulB', 'BattleDrop');
// Script\Battle\BattleDrop.js

/**战斗中的掉落物 */
var TypesHelper = null;
cc.Class({
    'extends': cc.Component,

    properties: {},
    ///初始化 战斗信息
    initBattleData: function initBattleData() {
        //血量
        var hp = 0;
        //攻击
        var attack = 0;
        //防御
        var defence = 0;
        //攻击范围
        var attackRange = 0;
        //速度
        var speed = 0;
        //初始化 战斗数据
        this.getComponent('BattleUnitDataManager').initData(hp, 0, attack, defence, attackRange, TypesHelper.BattleUnitTypes.Drop, this, false);
        this.getComponent('BattleContactManager').init(TypesHelper.BattleContactTypes.Player, this, true);
    },
    // use this for initialization
    onLoad: function onLoad() {
        TypesHelper = window.types;
        this.initBattleData();
    },
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },

    ///死亡
    dead: function dead() {},

    ///碰撞
    contact: function contact(target) {
        this.getComponent('BattleUnitDataManager').isDead = true;
        this.getComponent('BattleContactManager').isActive = false;
        var unitType = target.getComponent('BattleUnitDataManager').unitType;
        var owner = target.getComponent('BattleUnitDataManager').owner;
        if (owner) {
            this.deadEffect(owner);
        } else {
            this.deadEffect(target);
        }
    },

    ///死亡效果
    deadEffect: function deadEffect(target) {
        ////死亡效果类型
    }
});

cc._RFpop();
},{}],"BattleGeneral":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'faf33fregBPw7GKskD2OhYM', 'BattleGeneral');
// Script\Battle\BattleGeneral.js

/** 副将管理脚本 **/
var TypesHelper = null;
cc.Class({
    'extends': cc.Component,
    properties: {},
    //初始化战斗数据
    initBattleData: function initBattleData() {
        var csvGeneral = this.Data.CfgGeneral;
        var level = 1;
        var hp = csvGeneral.get('output');
        var attack = csvGeneral.get('attack');
        var defence = csvGeneral.get('defense');
        var attackRange = this.Data.WarningRange;
        var speed = this.Data.Speed;
        this.getComponent('BattleUnitDataManager').initData(hp, speed, attack, defence, attackRange, TypesHelper.BattleUnitTypes.General, this, true);
        this.Data.curHp = hp;
        this.Data.maxHp = hp;
    },

    ///
    initData: function initData() {
        TypesHelper = window.types;
        var csvgeneral = window.csv.get('general_csv', 2001);
        var monster_id = csvgeneral.get('monster_id');
        var cfgMonster = window.csv.get('monster_csv', monster_id);
        this.Data = {};
        this.Data.NeedCommander = csvgeneral.get('need_commander');
        this.Data.Speed = cfgMonster.get('speed');
        this.Data.WarningRange = cfgMonster.get('warning_range');
        this.Data.CfgGeneral = csvgeneral;
        var speed = this.Data.Speed;
        this.getComponent('BattleMoveManager').initData(speed, TypesHelper.BattleMoveStatus.Free, false, null, cc.p(0, 0));
        this.getComponent('BattleMoveManager').setIsAutoRandomMove(true);
        this.initBattleData();
        this.getComponent('BattleSkillManager').initData(this);
        this.getComponent('BattleSkillManager').putSkill(cfgMonster.get('attack_skillid'));

        var self = this;
        var clip_path = "111clip/" + cfgMonster.get('resource_name');
        ///纹理切换
        var sprite = self.node.getChildByName('sprite');
        cc.loader.loadRes(clip_path, cc.AnimationClip, function (err, clip) {
            sprite.getComponent(cc.Animation).addClip(clip, 'run');
            sprite.getComponent(cc.Animation).play('run');
        });

        cc.loader.loadRes("111clip/Attack", cc.AnimationClip, function (err, clip) {
            sprite.getComponent(cc.Animation).addClip(clip, 'attack');
            //cc.log('clip...........',clip);
        });

        if (!this.owner) {
            this.owner = null;
        } else {
            this.setParent(this.owner);
        }
    },

    ///血条刷新
    updateHp: function updateHp(changeNum) {
        var hp_bar = this.node.getChildByName('hp_bar');
        var bar = hp_bar.getComponent(cc.ProgressBar);
        this.Data.curHp += changeNum;
        if (this.Data.curHp > this.Data.maxHp) {
            this.Data.curHp = this.Data.maxHp;
        }
        var percent = this.Data.curHp / this.Data.maxHp;
        bar.progress = percent;
        if (percent >= 1) {
            hp_bar.active = false;
        } else {
            hp_bar.active = true;
        }
    },

    // use this for initialization
    onLoad: function onLoad() {
        this.initData();
        var actionHelper = window.actionHelper;
        var scaleAction = actionHelper.createLoopAction(-1, actionHelper.createScaleAction(0.2, 1.1, 1.1, 0.9, 0.9));
        this.node.runAction(scaleAction);
        var rotateAction = actionHelper.createLoopAction(-1, actionHelper.createRotateAction(0.3, 15, 15));
        this.node.runAction(rotateAction);
        var sprite = this.node.getChildByName('sprite');
        var moveAction = actionHelper.createLoopAction(-1, actionHelper.createMoveAction(0.25, 15, 0));
        if (sprite) {
            sprite.runAction(moveAction);
        }
    },

    ///攻击
    attack: function attack() {
        var sprite = this.node.getChildByName('sprite');
        //sprite.getComponent(cc.Animation).playAdditive('attack');
    },

    // 受伤
    hurt: function hurt(damage) {
        this.updateHp(damage);
    },

    //死亡
    dead: function dead() {},

    ///找到敌方单位
    findEnemy: function findEnemy(target) {
        this.getComponent('BattleMoveManager').setIsNeedWaitting(true);
        this.getComponent('BattleMoveManager').changeMoveStatus(TypesHelper.BattleMoveStatus.FoloowGroup);
        this.getComponent('BattleMoveManager').changeFoloowTarget(target);
    },

    ///离开敌方单位
    outOfEnemy: function outOfEnemy() {
        this.getComponent('BattleMoveManager').setIsNeedWaitting(false);
        if (!this.owner) {
            this.getComponent('BattleMoveManager').changeMoveStatus(TypesHelper.BattleMoveStatus.Free);
            this.getComponent('BattleMoveManager').changeFoloowTarget(null);
        } else {
            this.getComponent('BattleMoveManager').changeMoveStatus(TypesHelper.BattleMoveStatus.FoloowGroup);
            this.getComponent('BattleMoveManager').changeFoloowTarget(this.owner);
        }
    },

    setParent: function setParent(target) {
        this.owner = target;
        // 使用给定的模板在场景中生成一个新节点
        var radius = cc.random0To1() * 360 * 0.017453293;
        var sinx = Math.sin(radius);
        var cosx = Math.cos(radius);
        var a = 30;
        var b = 50;
        var x = b * sinx;
        var y = a * cosx;
        this.ownerPos = cc.p(x, y);
        //初始化 运动状态
        var speed = this.Data.Speed;
        this.getComponent('BattleMoveManager').initData(speed, TypesHelper.BattleMoveStatus.FoloowGroup, false, this.owner, this.ownerPos);
        target.getComponent('BattlePlayer').putChild(this.node);
        target.getComponent('BattlePlayer').updateCommander(this.Data.NeedCommander);
        this.getComponent('BattleMoveManager').setIsAutoRandomMove(false);
        cc.log('pos:', this.ownerPos);
        //this.getComponent('BattleContactManager').isActive = false;
    }
});
// called every frame, uncomment this function to activate update callback
// update: function (dt) {

// },

cc._RFpop();
},{}],"BattleHouse":[function(require,module,exports){
"use strict";
cc._RFpush(module, '16bd5sWgzZBM5ImXoeyuFsP', 'BattleHouse');
// Script\Battle\BattleHouse.js

var CsvHelper = null;
var TypesHelper = null;
/**建筑物脚本**/
cc.Class({
    'extends': cc.Component,
    properties: {},

    ///初始化 战斗数据
    initBattleData: function initBattleData() {
        var csvlead = this.Data.cfgHouse;
        var level = 1;
        var hp = csvlead.get('output');
        var attack = 0;
        var defence = csvlead.get('defense');
        var attackRange = 0;
        var speed = 0;
        this.getComponent('BattleUnitDataManager').initData(hp, speed, attack, defence, attackRange, TypesHelper.BattleUnitTypes.House, this, true);
    },

    //初始化数据
    _initData: function _initData() {
        CsvHelper = window.csv;
        TypesHelper = window.types;
        this.Target = null;
        var type = 4001;
        var level = 1;
        this.Data = {};
        var house_csv = CsvHelper.get('house_csv', type, level);
        //cc.log('house_csv', house_csv);
        this.Data.cfgHouse = house_csv;
        this.Data.curHp = house_csv.get('output');
        this.Data.maxHp = house_csv.get('output');
        this.initBattleData();
    },

    //刷新血条
    updateHp: function updateHp(changeNum) {
        var hp_bar = this.node.getChildByName('hp_bar');
        var bar = hp_bar.getComponent(cc.ProgressBar);
        this.Data.curHp += changeNum;
        if (this.Data.curHp > this.Data.maxHp) {
            this.Data.curHp = this.Data.maxHp;
        }
        var percent = this.Data.curHp / this.Data.maxHp;
        bar.progress = percent;
        if (percent >= 1) {
            hp_bar.active = false;
        } else {
            hp_bar.active = true;
        }
    },

    // use this for initialization
    onLoad: function onLoad() {
        this.isDead = false;
        this._initData();
        this.updateHp(0);
        var sprite = this.node.getChildByName('sprite');
        var actionHelper = window.actionHelper;
        var moveAction = actionHelper.createLoopAction(-1, actionHelper.createMoveAction(1.0, 0, 15));
        sprite.runAction(moveAction);
    },

    // called every frame, uncomment this function to activate update callback
    update: function update(dt) {
        var zorder = 1920 - this.node.getPosition().y;
        this.node.setLocalZOrder(zorder);
        ///死亡
        if (this.Data.curHp <= 0) {
            this.isDead = true;
        }
    },

    ///受伤
    hurt: function hurt(damage) {
        this.updateHp(damage);
        var animation = this.node.getChildByName('sprite').getComponent(cc.Animation);
        animation.play('Shake');
    },

    ///死亡
    dead: function dead() {}
});

cc._RFpop();
},{}],"BattleMain":[function(require,module,exports){
"use strict";
cc._RFpush(module, '1ad8csx97hGG6zI+Fde/aeO', 'BattleMain');
// Script\Battle\BattleMain.js

/***游戏主逻辑脚本***/
var TypesHelper = null;
cc.Class({
    'extends': cc.Component,

    properties: {
        ///小兵模板
        ChildPrefab: {
            'default': null,
            type: cc.Prefab
        },

        //副将模板
        GeneralPrefab: {
            'default': null,
            type: cc.Prefab
        },

        ///特效模板
        EffectPrefab: {
            'default': null,
            type: cc.Prefab
        },

        ///伤害模板
        DamagePrefab: {
            'default': null,
            type: cc.Prefab
        },

        ///伤害模板
        HouseHurEffectPrefab: {
            'default': null,
            type: cc.Prefab
        },

        ///警示区模板
        WarnningNodePrefab: {
            'default': null,
            type: cc.Prefab
        },

        /// player 节点
        player: {
            'default': null,
            type: cc.Node
        },
        ///bgm
        bgmClip: {
            'default': null,
            url: cc.AudioClip
        },
        /// 建筑物
        battleUnitArray: {
            'default': [],
            type: [cc.Node]
        },
        width: 0,
        height: 0
    },
    /*
    ctor: function (){
        window.battleMain = this; 
    },
    */
    // use this for initialization
    onLoad: function onLoad() {
        TypesHelper = window.types;
        window.battleMain = this;
        this.isOver = false;
        ///
        cc.director.setDisplayStats(true);
        cc._initDebugSetting(cc.DebugMode.ERROR);
        /*
        if (cc._renderType === cc.game.RENDER_TYPE_CANVAS) {
            cc.renderer.enableDirtyRegion(false);
        }
        */
        ///
        this.effectPool = new cc.NodePool();
        var initCount = 10;
        for (var i = 0; i < initCount; ++i) {
            var effect = cc.instantiate(this.EffectPrefab); // 创建节点
            this.effectPool.put(effect); // 通过 putInPool 接口放入对象池
        }

        initCount = 5;
        //战斗伤害飘血
        this.battleDamageNumPool = new cc.NodePool();
        for (var i = 0; i < initCount; ++i) {
            var effect = cc.instantiate(this.DamagePrefab); // 创建节点
            this.battleDamageNumPool.put(effect); // 通过 putInPool 接口放入对象池
        }

        //战斗对话
        this.talkPopPool = new cc.NodePool();
        for (var i = 0; i < initCount; ++i) {
            var effect = cc.instantiate(this.DamagePrefab); // 创建节点
            this.talkPopPool.put(effect); // 通过 putInPool 接口放入对象池
        }

        //建筑物受击
        this.houseHurEffectPool = new cc.NodePool();
        for (var i = 0; i < initCount; ++i) {
            var effect = cc.instantiate(this.HouseHurEffectPrefab); // 创建节点
            this.houseHurEffectPool.put(effect); // 通过 putInPool 接口放入对象池
        }

        //警戒区
        this.warnningNodePool = new cc.NodePool();
        for (var i = 0; i < initCount; ++i) {
            var effect = cc.instantiate(this.WarnningNodePrefab); // 创建节点
            this.warnningNodePool.put(effect); // 通过 putInPool 接口放入对象池
        }

        var delay = cc.delayTime(0.1);
        var finish = cc.callFunc(this.initAction, this);
        this.node.runAction(cc.sequence(delay, finish));
    },

    initAction: function initAction() {
        var initCount = 5;
        for (var i = 0; i < initCount; ++i) {
            var child = this.createNewChild(this.player);
            child.setPosition(this.player.getPosition());
        }
        var GeneralPrefab = this.createGeneral(this.player);
        GeneralPrefab.setPosition(this.player.getPosition());
    },

    ///创建警示区
    createWarnningNode: function createWarnningNode(time, pos, radius, startAngle, endAngle) {
        var effect = null;
        var background = this.node.getChildByName('background');
        if (this.warnningNodePool.size() > 0) {
            // 通过 size 接口判断对象池中是否有空闲的对象
            effect = this.warnningNodePool.get();
        } else {
            // 如果没有空闲对象，也就是对象池中备用对象不够时，我们就用 cc.instantiate 重新创建
            effect = cc.instantiate(this.WarnningNodePrefab);
            this.warnningNodePool.put(effect);
        }
        effect.setPosition(pos);
        effect.parent = background; // 将生成的敌人加入节点树
        effect.getComponent(cc.Graphics).clear();
        effect.getComponent('WarnningNode').setTime(time);
        effect.getComponent('WarnningNode').poolManager = this.warnningNodePool;
        effect.zIndex = 0;
        effect.getComponent('WarnningNode').arc(radius, startAngle, endAngle);
    },

    /// 技能触发
    skillEffect: function skillEffect(attacker, defencer, damage, cfgSkill) {
        var pos = defencer.getPosition();
        this.createAttackEffect(attacker.getPosition());
        var real_pos = cc.p(0, 0);
        var rect = defencer.getBoundingBox();
        var background = this.node.getChildByName('background');
        rect.x -= rect.width / 2;
        var height = 250; //defencer.getChildByName('hp_bar').getPosition().y;
        var random_height = height - height * cc.random0To1() * 0.1;
        real_pos.y = pos.y + random_height;
        real_pos.x = rect.x + cc.random0To1() * rect.width;
        this.createDamageLabel(real_pos, damage);
        real_pos = cc.p(0, 0);
        random_height = height - height * cc.random0To1() * 0.8;
        real_pos.y = pos.y + random_height;
        real_pos.x = rect.x + cc.random0To1() * rect.width;
        var sar_str = cfgSkill.get('fire_say');
        if (sar_str != '') {
            var strarray = sar_str.split('#');
            var index = window.math.getRandom(0, strarray.length - 1);
            this.createAttackTalk(real_pos, strarray[index]);
        }
        this.createHouseHurtEffect(real_pos);
    },

    ///伤害飘雪
    createDamageLabel: function createDamageLabel(pos, damage) {
        var effect = null;
        var background = this.node.getChildByName('background');
        if (this.battleDamageNumPool.size() > 0) {
            // 通过 size 接口判断对象池中是否有空闲的对象
            effect = this.battleDamageNumPool.get();
        } else {// 如果没有空闲对象，也就是对象池中备用对象不够时，我们就用 cc.instantiate 重新创建
            //effect = cc.instantiate( this.DamagePrefab );
            //this.battleDamageNumPool.put( effect );
        }

        if (effect) {
            effect.getComponent('BattlePopTalk').init(damage, 'BattleDamagePop', false);
            effect.getComponent('BattlePopTalk').poolManager = this.battleDamageNumPool;
            effect.parent = background; // 将生成的敌人加入节点树
            effect.zIndex = 9999;
            effect.setPosition(pos);
        }
    },

    ///攻击对话
    createAttackTalk: function createAttackTalk(pos, str) {
        var effect = null;
        var background = this.node.getChildByName('background');
        if (this.talkPopPool.size() > 0) {
            // 通过 size 接口判断对象池中是否有空闲的对象
            effect = this.talkPopPool.get();
        } else {// 如果没有空闲对象，也就是对象池中备用对象不够时，我们就用 cc.instantiate 重新创建

        }

        if (effect) {
            effect.getComponent('BattlePopTalk').init(str, 'BattleTalkPop', true);
            effect.getComponent('BattlePopTalk').poolManager = this.talkPopPool;
            effect.parent = background; // 将生成的敌人加入节点树
            effect.zIndex = 9999;
            effect.setPosition(pos);
        }
    },

    ///攻击特效
    createHouseHurtEffect: function createHouseHurtEffect(pos) {
        var effect = null;
        var background = this.node.getChildByName('background');
        if (this.houseHurEffectPool.size() > 0) {
            // 通过 size 接口判断对象池中是否有空闲的对象
            effect = this.houseHurEffectPool.get();
        } else {// 如果没有空闲对象，也就是对象池中备用对象不够时，我们就用 cc.instantiate 重新创建
            //effect = cc.instantiate( this.HouseHurEffectPrefab );
            //this.houseHurEffectPool.put( effect );
        }

        if (effect) {
            effect.getComponent('HouseHurtEffect').init();
            effect.getComponent('HouseHurtEffect').poolManager = this.houseHurEffectPool;
            effect.zIndex = 9999;
            effect.parent = background; // 将生成的敌人加入节点树
            effect.setPosition(pos);
        }
    },

    /// 攻击特效
    createAttackEffect: function createAttackEffect(pos) {
        var effect = null;
        var real_pos = pos;
        //cc.log('pos:y  ', pos.y);
        if (this.effectPool.size() > 0) {
            // 通过 size 接口判断对象池中是否有空闲的对象
            effect = this.effectPool.get();
        } else {
            // 如果没有空闲对象，也就是对象池中备用对象不够时，我们就用 cc.instantiate 重新创建
            effect = cc.instantiate(this.EffectPrefab);
            this.effectPool.put(effect);
        }
        effect.zIndex = 9999;
        effect.setPosition(real_pos);
        effect.getComponent('Effect').init(); //接下来就可以调用 enemy 身上的脚本进行初始化
        effect.getComponent('Effect').poolManager = this.effectPool; //接下来就可以调用 enemy 身上的脚本进行初始化
        var background = this.node.getChildByName('background');
        //let ani = background.getComponent( cc.Animation );
        //ani.play('Shake');
        effect.parent = background; // 将生成的敌人加入节点树
    },

    ///添加一个战斗单位
    addBattleUnit: function addBattleUnit(unit) {
        this.battleUnitArray.push(unit);
        this.battleUnitArray.sort(function (a, b) {
            return a.getComponent('BattleUnitDataManager').unitType - b.getComponent('BattleUnitDataManager').unitType;
        });
    },

    /// 生成副将
    createGeneral: function createGeneral(owner) {
        var GeneralPrefab = cc.instantiate(this.GeneralPrefab);
        var background = this.node.getChildByName('background');
        GeneralPrefab.getComponent('BattleGeneral').owner = owner;
        background.addChild(GeneralPrefab);
        this.addBattleUnit(GeneralPrefab);
        return GeneralPrefab;
    },

    /// 生成怪物
    createNewChild: function createNewChild(owner) {
        var ChildPrefab = cc.instantiate(this.ChildPrefab);
        var background = this.node.getChildByName('background');
        ChildPrefab.setPosition(this.getNewChildPosition());
        ChildPrefab.getComponent('BattleChild').targetPlayer = this.player;
        ChildPrefab.getComponent('BattleChild').owner = owner;
        background.addChild(ChildPrefab);
        this.addBattleUnit(ChildPrefab);
        return ChildPrefab;
    },

    /// 生成的位置
    getNewChildPosition: function getNewChildPosition() {
        var size = cc.view.getDesignResolutionSize();
        var randX = (this.width / 2 - cc.random0To1() * this.width) * 0.5 + this.width / 2;
        var randY = (this.height / 2 - cc.random0To1() * this.height) * 0.5 + this.height / 2;
        return cc.p(randX, randY);
    },

    // called every frame
    update: function update(dt) {
        var background = this.node.getChildByName('background');
        //let battleUnit = null;
        ///判断 是否 有战斗单位在房子的后面 ( 如果有的话, 需要降低房子的透明度以便显示 ）
        for (var i in this.battleUnitArray) {
            var houseUnit = this.battleUnitArray[i];
            var houseUnitType = houseUnit.getComponent('BattleUnitDataManager').unitType;
            if (houseUnitType != TypesHelper.BattleUnitTypes.House) {
                continue;
            }
            var house_pos = houseUnit.getPosition();
            var rect = houseUnit.getBoundingBox();
            rect.x -= rect.width / 2;
            var is_contact = false;
            for (var j in this.battleUnitArray) {
                var cur_battleUnit = this.battleUnitArray[j];
                var cur_battleUnitType = cur_battleUnit.getComponent('BattleUnitDataManager').unitType;
                if (cur_battleUnitType != TypesHelper.BattleUnitTypes.House) {
                    ///检测是否 有接触
                    if (rect.contains(cur_battleUnit.getPosition())) {
                        is_contact = true;
                        break;
                    }
                }
            }

            if (is_contact) {
                houseUnit.opacity = 150;
            } else {
                houseUnit.opacity = 255;
            }
        };

        if (this.player.getComponent('BattleUnitDataManager').isDead) {
            this.gameOver();
        }

        var enemyNum = 0;
        //循环遍历战斗单位状态
        for (var i in this.battleUnitArray) {
            var battleUnit = this.battleUnitArray[i];
            if (battleUnit.getComponent('BattleUnitDataManager').GroupIndex != this.player.getComponent('BattleUnitDataManager').GroupIndex) {
                enemyNum++;
            }
            if (battleUnit.getComponent('BattleUnitDataManager').isDead) {
                battleUnit.getComponent('BattleUnitDataManager').dead();
                battleUnit.removeFromParent();
                delete this.battleUnitArray[i];
            }
        }
        if (enemyNum <= 0 && !this.isOver) {
            this.gameOver();
        }
    },
    /// 游戏结束
    gameOver: function gameOver() {
        this.isOver = true;
        cc.director.loadScene('gameOver');
    }
});

cc._RFpop();
},{}],"BattleMoveManager":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'f228dExx15It6h+1VDttvTd', 'BattleMoveManager');
// Script\Battle\BattleMoveManager.js

/*移动逻辑管理 */
var TypesHelper = null;
var ActionHelper = null;
var CsvHelper = null;
cc.Class({
    'extends': cc.Component,
    properties: {},

    ///初始化移动信息
    initData: function initData(speed, status, isMoving, floowTarget, floowOffsetPos) {
        cc.log(this.node.getName(), 'floowOffsetPos', floowOffsetPos);

        //速度
        this.speed = speed;
        //运动状态
        this.moveStatus = status;
        //是否移动
        this.isMoving = isMoving;
        //移动目标
        this.foloowTarget = floowTarget;
        //目标偏移
        this.floowOffsetPos = floowOffsetPos;
        //目标位置
        this.targetPos = cc.p(0, 0);
        //所需移动时间
        this.needMoveTime = 0;
        //随机位移的时间间隔
        this.movePosRandomCD = 0;
        //随机范围
        this.randomSize = new cc.size(1280, 1920);
        //随机移动的cd
        this.autoRandomMoveCD = 5.0;
        //是否自动随机移动
        this.isAutoRandomMove = false;
        //
        this.isNeedWaitting = false;
    },

    // use this for initialization
    onLoad: function onLoad() {
        TypesHelper = window.types;
        ActionHelper = window.actionHelper;
        CsvHelper = window.csv;
        //环绕 半径
        this.radius_a = 30;
        this.radius_b = 50;
    },

    updateStatus: function updateStatus(dt) {},

    // 切换跟随目标
    changeFoloowTarget: function changeFoloowTarget(floowTarget) {
        this.foloowTarget = floowTarget;
    },

    setIsNeedWaitting: function setIsNeedWaitting(isWait) {
        this.isNeedWaitting = isWait;
    },

    //设置是否 自动随机寻路
    setIsAutoRandomMove: function setIsAutoRandomMove(isAutoRandomMove) {
        this.isAutoRandomMove = isAutoRandomMove;
    },

    ///随机移动
    _autoRandomMove: function _autoRandomMove() {
        var width = this.randomSize.width;
        var height = this.randomSize.height;
        var randX = (width / 2 - cc.random0To1() * width) * 0.5 + width / 2;
        var randY = (height / 2 - cc.random0To1() * height) * 0.5 + height / 2;
        //cc.log('auto move...', this.node.getName(), randX, '   ', randY );
        this.moveToTarget(cc.p(randX, randY));
    },

    // 移动到指定的目标
    moveToTarget: function moveToTarget(targetPos) {
        this.targetPos = targetPos;
        this.isMoving = true;
        ///当前的位置
        var curPos = this.node.position;
        var dis = Math.abs(cc.pDistance(curPos, targetPos));
        ///计算所需的移动时间
        this.needMoveTime = dis / this.speed;
        window.math.getAngle(curPos, targetPos);
    },

    // 改变 移动状态
    changeMoveStatus: function changeMoveStatus(status) {
        this.moveStatus = status;
    },

    // called every frame, uncomment this function to activate update callback
    update: function update(dt) {
        this.autoRandomMoveCD -= dt;
        ///层级关系
        var zorder = 1920 - this.node.getPosition().y;
        this.node.setLocalZOrder(zorder);
        if (this.isNeedWaitting) {
            return;
        }
        if (this.moveStatus === TypesHelper.BattleMoveStatus.Stop) {
            return;
        } else if ((this.moveStatus === TypesHelper.BattleMoveStatus.FoloowGroup || this.moveStatus === TypesHelper.BattleMoveStatus.FoloowFree) && !this.foloowTarget) {
            return;
        } else if (this.moveStatus === TypesHelper.BattleMoveStatus.Free && !this.isMoving) {
            if (this.isAutoRandomMove && this.autoRandomMoveCD <= 0) {
                this._autoRandomMove();
                this.autoRandomMoveCD = 5.0;
            }
            return;
        }

        var targetPos = this.targetPos;
        var curPos = this.node.getPosition();
        if (this.moveStatus === TypesHelper.BattleMoveStatus.FoloowGroup || this.moveStatus === TypesHelper.BattleMoveStatus.FoloowFree) {
            var target = this.foloowTarget;
            var curTargetPos = target.getPosition();
            var floowOffsetPos = this.floowOffsetPos;
            if (this.moveStatus === TypesHelper.BattleMoveStatus.FoloowFree) {
                this.movePosRandomCD -= dt;
                if (this.movePosRandomCD <= 0) {
                    var radius = cc.random0To1() * 360 * 0.017453293;
                    var sinx = Math.sin(radius);
                    var cosx = Math.cos(radius);
                    var x = radius_b * 2 * sinx;
                    var y = radius_a * 2 * cosx;
                    floowOffsetPos = cc.p(x, y);
                    this.floowOffsetPos = floowOffsetPos;
                    this.movePosRandomCD = 1.0 + cc.random0To1();
                }
            }
            targetPos = cc.pAdd(floowOffsetPos, curTargetPos);
        }
        var dis = Math.abs(cc.pDistance(curPos, targetPos));
        if (dis <= 0) return;
        var direction = cc.pNormalize(cc.pSub(targetPos, curPos));
        var time = dt;
        var last_speed = this.speed;
        if (this.moveStatus === TypesHelper.BattleMoveStatus.FoloowFree) {
            last_speed *= 1.5;
        }

        var newPos = cc.pAdd(curPos, cc.pMult(direction, last_speed * time));
        var new_dis = Math.abs(cc.pDistance(curPos, newPos));
        if (new_dis > dis) {
            this.isMoving = false;
            newPos = targetPos;
        }
        this.node.setPosition(newPos);
    }

});

cc._RFpop();
},{}],"BattlePlayer":[function(require,module,exports){
"use strict";
cc._RFpush(module, '93d0bCjH7hCUKV6Wq4eubXT', 'BattlePlayer');
// Script\Battle\BattlePlayer.js

/**玩家逻辑管理 */
var TypesHelper = null;
cc.Class({
    'extends': cc.Component,

    properties: {
        CommanderLabel: cc.Label,
        HpBar: cc.ProgressBar
    },

    // 初始化数据
    initData: function initData() {
        TypesHelper = window.types;
        var csvlead = window.csv.get('lead_csv', 1001);
        this.isDead = false;
        this.node.GroupTypeIsFree = false;
        this.Data = {};
        this.Data.Speed = csvlead.get('speed');
        this.Data.MaxCommander = csvlead.get('commander');
        this.Data.CurCommander = 0;
        this.Data.CfgLead = csvlead;
        this._initBattleData();
        var speed = this.Data.Speed;
        ///一个子类列表
        this.childArray = new Array();
        this.getComponent('BattleMoveManager').initData(speed, TypesHelper.BattleMoveStatus.Free, false, null, cc.p(0, 0));

        var cfgMonster = window.csv.get('monster_csv', 101);
        var clip_path = "111clip/" + cfgMonster.get('resource_name');
        var self = this;
        cc.loader.loadRes(clip_path, cc.AnimationClip, function (err, clip) {
            var sprite = self.node.getChildByName('sprite');
            sprite.getComponent(cc.Animation).addClip(clip, "run");
            sprite.getComponent(cc.Animation).play('run');
        });
    },

    // 初始化 战斗 数据
    _initBattleData: function _initBattleData() {
        var csvlead = this.Data.CfgLead;
        var level = 1;
        var hp = csvlead.get('initial_output') + csvlead.get('growth_output') * level;
        var attack = csvlead.get('initial_attack') + csvlead.get('growth_attack') * level;
        var defence = csvlead.get('initial_defense') + csvlead.get('growth_defense') * level;
        var attackRange = 0;
        var speed = this.Data.Speed;
        this.getComponent('BattleUnitDataManager').initData(hp, speed, attack, defence, attackRange, TypesHelper.BattleUnitTypes.Player, this, true);

        this.Data.curHp = hp;
        this.Data.maxHp = hp;
    },

    ///添加子类到子类 列表
    putChild: function putChild(child) {
        this.childArray.push(child);
    },

    ///移除子类
    removeChild: function removeChild(targetChild) {
        for (var i in this.childArray) {
            var child = this.childArray[i];
            if (child === targetChild) {
                delete this.childArray[i];
            }
        }
    },

    // 检测统帅值
    checkCommander: function checkCommander(num) {
        if (this.Data.CurCommander >= this.Data.MaxCommander) {
            return false;
        }
        return true;
    },

    // 初始化ui
    updateCommander: function updateCommander(num) {
        this.Data.CurCommander += num;
        this.CommanderLabel.string = this.Data.CurCommander + '/' + this.Data.MaxCommander;
    },

    // use this for initialization
    onLoad: function onLoad() {
        this.initData();
        this.updateCommander(this.Data.CurCommander);

        var actionHelper = window.actionHelper;

        var scaleAction = actionHelper.createLoopAction(-1, actionHelper.createScaleAction(0.2, 1.1, 1.1, 0.9, 0.9));
        this.node.runAction(scaleAction);

        var rotateAction = actionHelper.createLoopAction(-1, actionHelper.createRotateAction(0.3, 15, 15));
        this.node.runAction(rotateAction);

        var sprite = this.node.getChildByName('sprite');
        var moveAction = actionHelper.createLoopAction(-1, actionHelper.createMoveAction(0.25, 15, 0));
        if (sprite) {
            sprite.runAction(moveAction);
        }
    },

    ///受伤
    hurt: function hurt(damage) {
        var hp_bar = this.HpBar;
        var bar = hp_bar.getComponent(cc.ProgressBar);
        this.Data.curHp += damage;
        if (this.Data.curHp > this.Data.maxHp) {
            this.Data.curHp = this.Data.maxHp;
        }
        var percent = this.Data.curHp / this.Data.maxHp;
        bar.progress = percent;
    },

    // called every frame, uncomment this function to activate update callback
    update: function update(dt) {},

    ///死亡
    dead: function dead(dt) {},

    ///找到敌方单位
    findEnemy: function findEnemy(target) {},

    ///离开敌方单位
    outOfEnemy: function outOfEnemy() {}
});

cc._RFpop();
},{}],"BattlePopTalk":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'b7f33hA6AtBuoaV4Qiog2Li', 'BattlePopTalk');
// Script\Battle\BattlePopTalk.js

cc.Class({
    'extends': cc.Component,
    properties: {},

    // use this for initialization
    onLoad: function onLoad() {
        //cc.log('damageenter........');
        var animation = this.node.getComponent(cc.Animation);
        animation.on('finished', this.onFinish, this);
    },

    onFinish: function onFinish() {
        cc.log('damagefinish........');
        this.poolManager.put(this.node);
    },

    init: function init(string, action_name, is_rotate) {
        var animation = this.node.getComponent(cc.Animation);
        var label_node = this.node.getChildByName('label_num');
        var label = label_node.getComponent(cc.Label);
        label.string = string;
        animation.play(action_name);
        label_node.rotation = 0;
        label_node.opacity = 255;
        if (is_rotate) {
            var rotation = 30 - cc.random0To1() * 60;
            label_node.rotation = rotation;
            /*
            label_node.color = new cc.Color( 255, 255, 255 );
            let delay = cc.delayTime( 1.0 );
            //let fade = cc.fadeOut( 1.0 );
            var finish = cc.callFunc( this.onFinish, this );
            label_node.runAction( cc.sequence( delay, finish ) );
            */
        } else {}
            /*
            label_node.color = new cc.Color( 255, 0, 0 );
            label_node.scale = 0;
            label_node.setPosition( cc.p(0, 0) );
            let act1 = cc.scaleTo(0.2, 1.0);
            let act2 = cc.moveBy(1.0, cc.p(0, 50));
            let act3 = cc.scaleTo(0.2, 1.5);
            let fade = cc.fadeOut( 0.2 );
            //let act3 = cc.spawn(move, fade);
            var finish = cc.callFunc( this.onFinish, this );
            label_node.runAction( cc.sequence( act1, act2, act3, finish ) );
            */

            /*
            let delay = cc.delayTime( 1.0 );
            var finish = cc.callFunc( this.onFinish, this );
            this.node.runAction( cc.sequence( delay, finish ) );
            */
    }

});
// called every frame, uncomment this function to activate update callback
/*
update: function ( dt ) {
    let label = this.node.getChildByName('label_num');
    this.curNum-=1;
    if( this.curNum < this.targetNum ) 
    {
        this.curNum = this.targetNum;
    }
    label.getComponent( cc.Label ).string = this.curNum;
},
*/

cc._RFpop();
},{}],"BattleSkillManager":[function(require,module,exports){
"use strict";
cc._RFpush(module, '34c97CEVztNJJYRveBP+NX+', 'BattleSkillManager');
// Script\Battle\BattleSkillManager.js

/*技能管理*/
var TypesHelper = null;
cc.Class({
    'extends': cc.Component,
    properties: {},

    initData: function initData(mainComponent) {
        TypesHelper = window.types;
        this.publicCD = 0;
        this.target = null;
        this.isWaittingSkill = false;
        this.mainComponent = mainComponent;
    },

    // use this for initialization
    onLoad: function onLoad() {},

    // use this for initialization
    putSkill: function putSkill(skill_id) {
        if (!this.skillArray) {
            this.skillArray = [];
        }
        var cfgskill = window.csv.get('skill_csv', skill_id);
        var skill = {
            cfgskill: cfgskill,
            dis: cfgskill.get('distance'),
            cd: 0,
            delay: 0,
            isLock: false,
            lockPos: cc.p(0, 0)
        };
        this.skillArray.push(skill);
    },

    //检测是否有技能可以触发
    _checkSkillEffct: function _checkSkillEffct(dt) {
        var target_pos = this.target.getPosition();
        var cur_pos = this.node.getPosition();
        var dis = cc.pDistance(target_pos, cur_pos);
        for (var i in this.skillArray) {
            var skill = this.skillArray[i];
            if (skill.cd > 0) {
                skill.cd -= dt;
            }
            if (this.isWaittingSkill) {
                if (skill.delay > 0) {
                    skill.delay -= dt;
                }
                if (skill.delay <= 0) {
                    this._effctSkill(skill);
                    this.isWaittingSkill = false;
                }
            } else {
                if (skill.cd <= 0 && dis <= skill.dis) {
                    this._effctSkill(skill);
                }
            }
        };
    },

    ///触发 技能
    _effctSkill: function _effctSkill(skill) {
        var cfgSkill = skill.cfgskill;
        var target_type = cfgSkill.get('target_type');
        var dis_range = cfgSkill.get('dis_range');
        var sector_radius = cfgSkill.get('sector_radius');
        var power_duration = cfgSkill.get('power_duration') / 1000;
        var fan_angle = cfgSkill.get('fan_angle');
        var fire_pos_type = cfgSkill.get('fire_pos_type');
        var type = cfgSkill.get('type');
        if (power_duration > 0 && !this.isWaittingSkill) {
            this.isWaittingSkill = true;
            this.getComponent('BattleMoveManager').is;
            skill.delay = power_duration;
            skill.isLock = true;
            if (fire_pos_type === 2) {
                skill.lockPos = this.target.getPosition();
            } else if (fire_pos_type === 1) {
                skill.lockPos = this.node.getPosition();
            }
            if (dis_range === 1) {
                var cur_pos = this.node.getPosition();
                var target_pos = skill.lockPos;
                var rad = window.math.getRad(cur_pos, target_pos);
                var start = rad - fan_angle / 2 * Math.PI / 180;
                var end = rad + fan_angle / 2 * Math.PI / 180;
                ///点
                if (type == TypesHelper.SkillAttackTypes.Single) {
                    window.battleMain.createWarnningNode(power_duration, target_pos, 1, 0, 2 * Math.PI);
                } else if (type == TypesHelper.SkillAttackTypes.Sector) {
                    ///扇形
                    window.battleMain.createWarnningNode(power_duration, target_pos, sector_radius, start, end);
                } else if (type == TypesHelper.SkillAttackTypes.Circle) {
                    ///圆形
                    window.battleMain.createWarnningNode(power_duration, target_pos, sector_radius, 0, 2 * Math.PI);
                }
            }
            return;
        } else {
            //技能cd
            skill.cd = cfgSkill.get('cd') / 1000;
            this.publicCD = cfgSkill.get('public_cd') / 1000;
        }

        var coea = cfgSkill.get('coea');
        var coeb = cfgSkill.get('coeb');
        if (type == TypesHelper.SkillAttackTypes.Single) {
            ///点
            this.attack(coea, coeb, this.target, cfgSkill);
        } else if (type == TypesHelper.SkillAttackTypes.Sector) {
            ///扇形
            cc.log('there is no Sector');
            this.attack(coea, coeb, this.target, cfgSkill);
        } else if (type == TypesHelper.SkillAttackTypes.Circle) {
            ///圆形
            for (var i in window.battleMain.getComponent('BattleMain').battleUnitArray) {
                var battleUnit = window.battleMain.getComponent('BattleMain').battleUnitArray[i];
                var group = battleUnit.getComponent('BattleUnitDataManager').GroupIndex;
                var isActive = battleUnit.getComponent('BattleUnitDataManager').isActive;
                var my_group = this.getComponent('BattleUnitDataManager').GroupIndex;
                ///和我同一组 或者 非激活状态
                if (group === my_group || !isActive) {
                    continue;
                }
                var pos = battleUnit.getPosition();
                var dis = cc.pDistance(skill.lockPos, pos);
                if (dis < sector_radius) {
                    this.attack(coea, coeb, battleUnit, cfgSkill);
                }
            }
        }
    },

    ///
    attack: function attack(coea, coeb, target, cfgSkill) {
        var attacker = this.getComponent('BattleUnitDataManager');
        var defencer = target.getComponent('BattleUnitDataManager');
        var attack = attacker.battleData.attack;
        var defence = defencer.battleData.defence;
        var damage = -attacker.caculateDamage(attack, defence, coea, coeb);
        defencer.hurt(damage);
        window.battleMain.skillEffect(this.node, target, damage, cfgSkill);
        this.mainComponent.attack();
    },

    // called every frame, uncomment this function to activate update callback
    update: function update(dt) {
        if (!this.skillArray) {
            return;
        }
        if (!this.target) {
            return;
        }
        this.publicCD -= dt;
        if (this.publicCD > 0) {
            return;
        }

        this._checkSkillEffct(dt);
    }
});

cc._RFpop();
},{}],"BattleUnitDataManager":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'cc753aiITVK+aU189doXkcp', 'BattleUnitDataManager');
// Script\Battle\BattleUnitDataManager.js

///战斗单位 数据管理类
var TypesHelper = null;
cc.Class({
    'extends': cc.Component,
    properties: {
        //分组
        GroupIndex: 0
    },
    /*
    ctor: function(){
        this.isActive = false;
        this.owner = null;
    },
    */
    //初始化数据
    initData: function initData(hp, speed, attack, defence, attackRange, unitType, mainComponent, isActive) {
        this.isActive = false;
        this.owner = null;
        var battleData = {};
        // 血量
        battleData.hp = hp;
        // 速度
        battleData.speed = speed;
        // 攻击力
        battleData.attack = attack;
        // 防御力
        battleData.defence = defence;
        // 攻击范围
        battleData.attackRanage = attackRange;
        //
        this.battleData = battleData;
        cc.log('attackRanage', this.battleData.attackRanage);
        // 是否死亡
        this.isDead = false;
        // 单位类型
        this.unitType = unitType;
        //
        this.mainComponent = mainComponent;
        //是否已激活
        this.isActive = isActive;
        cc.log('name:', this.node.getName(), 'hp:', hp, 'speed:', speed, 'attack:', attack, 'defence:', defence, 'attackRanage:', attackRange);
    },

    //死亡
    dead: function dead() {
        cc.log('dead........name: ', this.node.getName());
        this.mainComponent.dead();
    },

    //受伤 最终 真实伤害值
    hurt: function hurt(damage) {
        var hp = this.battleData.hp;
        hp += damage;
        //cc.log('hp:........', hp);
        if (hp <= 0) {
            this.isDead = true;
            //cc.log('this dead');
        }
        this.battleData.hp = hp;
        this.mainComponent.hurt(damage);
    },

    /*
    伤害计算
        攻击 = 攻击方攻击 * 攻击加成百分比 + 攻击加成数值
        防御 = 防守方防御 * 防御加成百分比 + 防御加成数值
        浮动因子 = 0.95~1.05之间随机
        伤害 =（（攻击-防御）* 技能系数a + 技能系数b）* 浮动因子 
    最低伤害
        若伤害低于最低伤害，则使用最低伤害
        最低伤害 = floor（攻击*0.05,1）
        若最低伤害 ＜ 1，则取 1
        加上技能的判断
    */
    /// 计算最终伤害值
    caculateDamage: function caculateDamage(attack, defence, coea, coeb) {
        var damage_percent = 1.0 + 0.05 - cc.random0To1() * 0.1;
        var damage = ((attack - defence) * coea + coeb) * damage_percent;
        damage = Math.floor(damage);
        if (damage < 1) {
            damage = 1;
        }
        return damage;
    },

    // use this for initialization
    onLoad: function onLoad() {
        TypesHelper = window.types;
        this.changeTargetCD = 1.0;
        this.Status = TypesHelper.BattleChildStatus.Stop;
    },

    // 跟随者
    setOwner: function setOwner(owner) {
        this.owner = owner;
    },

    //检测敌人是否在攻击范围内
    _checkIsFindEnemy: function _checkIsFindEnemy(enemy) {
        if (this.isDead) {
            return null;
        }
        var enemy_pos = enemy.getPosition();
        var cur_pos = this.node.getPosition();
        var dist = cc.pDistance(enemy_pos, cur_pos);
        var status = TypesHelper.BattleChildStatus.Stop;
        ///切换小兵的 状态 进入攻击状态
        if (dist <= this.battleData.attackRanage) {
            status = TypesHelper.BattleChildStatus.Attack;
        } else {
            status = TypesHelper.BattleChildStatus.Stop;
        }

        var oldPos = this.node.position;
        ///有父类的情况下
        if (this.owner) {
            var owner_pos = this.owner.getPosition();
            var player_dis = cc.pDistance(oldPos, owner_pos);
            if (status === TypesHelper.BattleChildStatus.Attack && player_dis >= 300) {
                status = TypesHelper.BattleChildStatus.Stop;
            }
        }
        if (this.unitType === TypesHelper.BattleUnitTypes.Child) {
            //cc.log('find enemy...', enemy.getName(), 'range', this.battleData.attackRanage );     
        }
        this.Status = status;
        if (status === TypesHelper.BattleChildStatus.Attack) {
            return enemy;
        } else if (status === TypesHelper.BattleChildStatus.Stop) {
            return null;
        }
    },

    ///切换目标
    changeTarget: function changeTarget(dt) {
        ///每隔一定的时间  查找 下 是否有优先级 更高的目标
        var noEnemy = true;
        for (var i in window.battleMain.getComponent('BattleMain').battleUnitArray) {
            var battleUnit = window.battleMain.getComponent('BattleMain').battleUnitArray[i];
            var group = battleUnit.getComponent('BattleUnitDataManager').GroupIndex;
            var isActive = battleUnit.getComponent('BattleUnitDataManager').isActive;
            var my_group = this.getComponent('BattleUnitDataManager').GroupIndex;
            ///和我同一组 或者 非激活状态
            if (group === my_group || !isActive) {
                continue;
            }
            var TargetEnemy = this._checkIsFindEnemy(battleUnit);
            this.getComponent('BattleSkillManager').target = TargetEnemy;
            this.targetEnemy = TargetEnemy;
            if (this.targetEnemy) {
                noEnemy = false;
                break;
            }
        }
        if (noEnemy) {
            //cc.log( 'noEnemy     changeTarget....', this.node.getName() );
            this.getComponent('BattleSkillManager').target = null;
            this.targetEnemy = null;
            this.getComponent('BattleMoveManager').changeFoloowTarget(this.owner);
            this.mainComponent.outOfEnemy();
        } else {
            //cc.log( 'changeTarget....', this.node.getName() );
            this.mainComponent.findEnemy(this.targetEnemy);
            this.getComponent('BattleMoveManager').changeFoloowTarget(this.targetEnemy);
        }
    },

    // called every frame, uncomment this function to activate update callback
    update: function update(dt) {
        if (!this.isActive) {
            return;
        }
        if (this.unitType === TypesHelper.BattleUnitTypes.Child || this.unitType === TypesHelper.BattleUnitTypes.General) {
            this.changeTargetCD -= dt;
            if (this.changeTargetCD <= 0) {
                this.changeTarget(dt);
                this.changeTargetCD = 1.0;
            }
        }
    }
});

cc._RFpop();
},{}],"CsvLoader":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'e9773kCyQZA8pALlLp10zTs', 'CsvLoader');
// Script\Util\CsvLoader.js

/* ---------------------------------------------------------------
 *  csv配置载入
 * ---------------------------------------------------------------
 */
var csv = cc.Class({

    // 载入
    load: function load() {
        var t = new Date().getTime();
        cc.log('--- csv load start ---------------------------------');
        this._loadSingle('lead_csv', null, 'office_id');
        this._loadSingle('soldier_csv', null, 'soldier_id');
        this._loadSingle('house_csv', null, 'house_type', 'house_lv');
        this._loadSingle('skill_csv', null, 'id');
        this._loadSingle('general_csv', null, 'id');
        this._loadSingle('status_csv', null, 'id');
        this._loadSingle('monster_csv', null, 'monster_id');
        this._loadSingle('monster_value_csv', null, 'monster_id');
        cc.log('--- csv load end, use time: %s -----------------------', new Date().getTime() - t);
    },

    // 获取，没有key时返回整个表，表以map方式存的，但有序，不同于lua
    get: function get(config_name) {
        if (!this[config_name]) return;
        // 生成key，需要和CSVParser中对应
        var key = '';
        for (var i = 1; i < arguments.length; i++) {
            // 0是config_name，所以1开始
            key += (i == 1 ? '' : '_') + arguments[i];
        }return key === '' ? this[config_name] : this[config_name][key];
    },

    // 行关键字生成
    _rowKey: function _rowKey(row, keys, head) {
        var r = '';
        var index = 0;
        for (var i = 0; i < keys.length; i++) {
            index = head[keys[i]];
            r += (i === 0 ? '' : '_') + row.__d[index];
        }
        return r;
    },

    // 载入单个
    _loadSingle: function _loadSingle(config_name, rowFunc) {
        var keys = [];
        for (var i = 2; i < arguments.length; i++) {
            keys.push(arguments[i]);
        }
        var m = require(config_name);
        var head = m.head,
            data = m.data;

        var get = function get(k) {
            var index = head[k];
            return index !== null ? this.__d[index] : null;
        };

        var new_data = {};
        for (var r = 0; r < data.length; r++) {
            var row = data[r];
            row.get = get.bind(row);
            if (rowFunc) rowFunc(row);

            var key = this._rowKey(row, keys, head);
            new_data[key !== '' ? key : r] = row;
        }

        this[config_name] = new_data;
    }
});

module.exports = csv;

cc._RFpop();
},{}],"Effect":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'c769cI/IrFJBrYVgO0EFZc3', 'Effect');
// Script\Effect.js

cc.Class({
    'extends': cc.Component,

    properties: {},

    // use this for initialization
    onLoad: function onLoad() {
        var animation = this.node.getComponent(cc.Animation);
        animation.on('finished', this.onFinish, this);
    },

    onFinish: function onFinish() {
        //cc.log('finish........');
        this.poolManager.put(this.node);
    },

    init: function init() {
        var animation = this.node.getComponent(cc.Animation);
        animation.play('AttackEffect');
    }
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});

cc._RFpop();
},{}],"GameOver":[function(require,module,exports){
"use strict";
cc._RFpush(module, '23785yish5E6a4iLz8zjEGL', 'GameOver');
// Script\GameOver.js

cc.Class({
    'extends': cc.Component,

    properties: {
        // foo: {
        //    default: null,      // The default value will be used only when the component attaching
        //                           to a node for the first time
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
    },

    // use this for initialization
    onLoad: function onLoad() {
        var delay = cc.delayTime(3.0);
        var finish = cc.callFunc(this.end, this);
        this.node.runAction(cc.sequence(delay, finish));
    },

    end: function end() {
        cc.director.loadScene('battle');
    }
});
// called every frame, uncomment this function to activate update callback
// update: function (dt) {

// },

cc._RFpop();
},{}],"GameStart":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'a16feBwNdhL3oA13SGEexRQ', 'GameStart');
// Script\GameStart.js

//const i18n = require('i18n');

cc.Class({
    'extends': cc.Component,

    properties: {},

    //
    onBtnSpeedClicked: function onBtnSpeedClicked() {
        cc.director.loadScene('battle');
    },

    // use this for initialization
    onLoad: function onLoad() {}

});
// called every frame, uncomment this function to activate update callback
// update: function (dt) {

// },

cc._RFpop();
},{}],"HelloWorld":[function(require,module,exports){
"use strict";
cc._RFpush(module, '280c3rsZJJKnZ9RqbALVwtK', 'HelloWorld');
// Script\HelloWorld.js

cc.Class({
    'extends': cc.Component,

    properties: {
        label: {
            'default': null,
            type: cc.Label
        },
        // defaults, set visually when attaching this script to the Canvas
        text: 'Hello, World!'
    },

    // use this for initialization
    onLoad: function onLoad() {
        this.label.string = this.text;
    },

    // called every frame
    update: function update(dt) {}
});

cc._RFpop();
},{}],"HouseHurtEffect":[function(require,module,exports){
"use strict";
cc._RFpush(module, '4ea11TakYRL8bke19dXfR0V', 'HouseHurtEffect');
// Script\Effect\HouseHurtEffect.js

cc.Class({
    'extends': cc.Component,

    properties: {
        // foo: {
        //    default: null,      // The default value will be used only when the component attaching
        //                           to a node for the first time
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
    },

    init: function init() {
        var particle_smoke = this.node.getChildByName('smoke').getComponent(cc.ParticleSystem);
        var particle_fragment = this.node.getChildByName('fragment').getComponent(cc.ParticleSystem);
        particle_smoke.resetSystem();
        particle_fragment.resetSystem();
        var delay = cc.delayTime(0.5);
        var finish = cc.callFunc(this.end, this);
        this.node.runAction(cc.sequence(delay, finish));
    },

    // use this for initialization
    onLoad: function onLoad() {},

    end: function end() {
        this.poolManager.put(this.node);
    }
});
// called every frame, uncomment this function to activate update callback
// update: function (dt) {

// },

cc._RFpop();
},{}],"Init":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'cb0f4oYGdtBCqyGbGTBOhi7', 'Init');
// Script\Init.js

/**初始化 加载脚本 */
var CSV = require('CsvLoader');
var ActionHelper = require('ActionHelper');
var Types = require('Types');
var Math = require('MathHelper');
cc.Class({
    'extends': cc.Component,

    properties: {},

    // use this for initialization
    onLoad: function onLoad() {
        ///csv帮助类
        var csv = new CSV();
        csv.load(); // load all csv, run once in game, put csv to global
        window.csv = csv;

        ////动作 帮助类
        var actionHelper = new ActionHelper();
        window.actionHelper = actionHelper;

        var math = new Math();
        window.math = math;

        ///类型定义
        window.types = Types;
    }

});
// called every frame, uncomment this function to activate update callback
// update: function (dt) {

// },

cc._RFpop();
},{"ActionHelper":"ActionHelper","CsvLoader":"CsvLoader","MathHelper":"MathHelper","Types":"Types"}],"MapManager":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'aa77eAJGoxGRKJfjR3nzWlx', 'MapManager');
// Script\Battle\MapManager.js

/**地图管理脚本 */
cc.Class({
    'extends': cc.Component,
    properties: {
        player: cc.Node,
        width: 0,
        height: 0
    },

    // use this for initialization
    onLoad: function onLoad() {
        //this.player = this.getComponent('game').player;
        this.last_pos = cc.p(0, 0);
    },

    // called every frame, uncomment this function to activate update callback
    update: function update(dt) {
        var player_pos = this.player.getPosition();
        var size = cc.view.getVisibleSize();
        var centerOfView = cc.p(size.width / 2, size.height / 2);
        var x = Math.max(centerOfView.x, player_pos.x);
        var y = Math.max(centerOfView.y, player_pos.y);
        x = Math.min(x, this.width - centerOfView.x);
        y = Math.min(y, this.height - centerOfView.y);
        var actualPosition = cc.p(x, y);
        var viewPoint = cc.pSub(centerOfView, actualPosition);
        if (this.last_pos.x != viewPoint.x || this.last_pos.y != viewPoint.y) {
            this.moveMap(cc.pSub(viewPoint, this.last_pos));
            this.last_pos = viewPoint;
        }
    },

    //  -------------------------------------------------------------------------------
    //  -- 地图移动
    //  -------------------------------------------------------------------------------
    moveMap: function moveMap(offset) {
        var background = this.node.getChildByName('background');
        var player_pos = this.player.getPosition();
        var map_pos = background.getPosition();
        map_pos = cc.pAdd(map_pos, offset);
        var size = cc.view.getVisibleSize();
        var min_w = size.width - this.width - size.width / 2;
        var min_h = size.height - this.height - size.height / 2;
        var max_w = -size.width / 2;
        var max_h = -size.height / 2;
        if (map_pos.x < min_w) {
            map_pos.x = min_w;
        }

        if (map_pos.y < min_h) {
            map_pos.y = min_h;
        }

        if (map_pos.x > max_w) {
            map_pos.x = max_w;
        }

        if (map_pos.y > max_h) {
            map_pos.y = max_h;
        }

        background.setPosition(map_pos);
    }
});

cc._RFpop();
},{}],"MathHelper":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'b1450RkRjNLEJOG6T/gtI9G', 'MathHelper');
// Script\Util\MathHelper.js

/* ---------------------------------------------------------------
 *  数学帮助类
 * ---------------------------------------------------------------
 */
var MathHelper = cc.Class({
    getRad: function getRad(start, end) {
        var offset_pos = cc.pSub(end, start);
        var angle = cc.pToAngle(offset_pos);
        if (offset_pos.y < 0) {
            angle += 2 * Math.PI;
        }
        //cc.log('pos:', offset_pos,'rad', angle,'angle:', angle * 180 / Math.PI );
        return angle;
    },

    ///获取角度
    getAngle: function getAngle(start, end) {
        var rad = this.getRad(start, end);
        return rad * 180 / Math.PI;
    },

    //取随机数
    getRandom: function getRandom(Min, Max) {
        var Range = Max - Min;
        var Rand = Math.random();
        return Min + Math.round(Rand * Range);
    }
});

module.exports = MathHelper;

cc._RFpop();
},{}],"OnTouchCtrl":[function(require,module,exports){
"use strict";
cc._RFpush(module, '0b4b1cdNkZMqaByi9qELtrK', 'OnTouchCtrl');
// Script\Battle\OnTouchCtrl.js

cc.Class({
    'extends': cc.Component,

    properties: {
        canvas: cc.Node,
        //目标
        follower: {
            'default': null,
            type: cc.Node
        },
        TouchPoint: {
            'default': null,
            type: cc.Prefab
        }
    },

    // use this for initialization
    onLoad: function onLoad() {
        this.touchPool = new cc.NodePool();
        var initCount = 10;
        for (var i = 0; i < initCount; ++i) {
            var touchPrefab = cc.instantiate(this.TouchPoint); // 创建节点
            this.touchPool.put(touchPrefab); // 通过 putInPool 接口放入对象池
        }
        var self = this;
        ////触摸事件监听注册
        self.canvas.on(cc.Node.EventType.TOUCH_START, function (event) {
            //点击移动
            var touches = event.getTouches();
            var touchLoc = touches[0].getLocation();
            var target_pos = self.follower.parent.convertToNodeSpaceAR(touchLoc);
            //self.follower.getComponent('BattlePlayer').moveToTarget( target_pos );

            self.follower.getComponent('BattleMoveManager').moveToTarget(target_pos);
            ////生存一个点击的标记
            var touchPrefab = null;
            if (self.touchPool.size() > 0) {
                // 通过 size 接口判断对象池中是否有空闲的对象
                touchPrefab = self.touchPool.get();
            } else {
                // 如果没有空闲对象，也就是对象池中备用对象不够时，我们就用 cc.instantiate 重新创建
                touchPrefab = cc.instantiate(self.TouchPoint);
                self.touchPool.put(touchPrefab);
            }
            touchPrefab.setPosition(target_pos);
            touchPrefab.parent = self.follower.parent; // 将生成的敌人加入节点树
            touchPrefab.getComponent('TouchPoint').init(); //接下来就可以调用 enemy 身上的脚本进行初始化
            touchPrefab.getComponent('TouchPoint').poolManager = self.touchPool;
        }, self.node);
        self.canvas.on(cc.Node.EventType.TOUCH_MOVE, function (event) {}, self.node);
        self.canvas.on(cc.Node.EventType.TOUCH_END, function (event) {}, self.node);
    },

    // called every frame
    update: function update(dt) {}
});

cc._RFpop();
},{}],"TouchPoint":[function(require,module,exports){
"use strict";
cc._RFpush(module, '03179TPXt1F3oAHnMkAcjZq', 'TouchPoint');
// Script\Battle\TouchPoint.js

var ActionHelper = cc.Class({
    'extends': cc.Component,

    properties: {},

    // use this for initialization
    onLoad: function onLoad() {},

    init: function init() {
        var img_point = this.node.getChildByName('img_point');
        var img_circle = this.node.getChildByName('img_circle');

        var move1 = cc.moveBy(1.0, cc.p(0, 20));
        var move2 = cc.moveBy(1.0, cc.p(0, -20));
        img_point.runAction(cc.repeatForever(cc.sequence(move1, move2)));

        var scale1 = cc.scaleTo(1.0, 0.8);
        var scale2 = cc.scaleTo(1.0, 1.0);
        img_circle.runAction(cc.repeatForever(cc.sequence(scale1, scale2)));

        var delay = cc.delayTime(0.5);
        var fade = cc.fadeOut(1.0);
        var finish = cc.callFunc(this.end, this);
        this.node.runAction(cc.sequence(delay, fade, finish));
    },

    end: function end() {
        var img_point = this.node.getChildByName('img_point');
        var img_circle = this.node.getChildByName('img_circle');
        this.node.stopAllActions();
        img_point.stopAllActions();
        img_circle.stopAllActions();
        img_circle.scale = 1.0;
        img_point.position = cc.p(0, 33);
        this.node.opacity = 255;
        this.poolManager.put(this.node);
    }

});
// called every frame, uncomment this function to activate update callback
// update: function (dt) {

// },

cc._RFpop();
},{}],"Types":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'eee60uGfDtPZLJykgcYs+ci', 'Types');
// Script\Util\Types.js

/**枚举声明**/
//战斗小弟状态
var BattleChildStatus = cc.Enum({
    Stop: 1, //停止
    Foloow: 2, //跟随
    Attack: 3 //攻击
});

//战斗的移动状态
var BattleMoveStatus = cc.Enum({
    Stop: 1, //停止
    FoloowGroup: 2, //跟随
    FoloowFree: 3, //跟随
    Free: 4 //自由
});

//技能攻击类型
var SkillAttackTypes = cc.Enum({
    Single: 1, //单体
    Sector: 2, //扇形
    Circle: 3 });

//技能目标类型
//圆形 
var SkillTargetTypes = cc.Enum({
    Self: 1, //自己
    Enemy: 2, //敌方
    All: 3, //所有目标
    Friends: 4 });

//战斗单位类型
//包括自己在内的友方 
var BattleUnitTypes = cc.Enum({
    Player: 1, // 自己
    General: 2, // 副将
    Child: 3, // 小弟
    House: 4, // 建筑物
    Drop: 5 });

//战斗单位类型
// 掉落物
var BattleContactTypes = cc.Enum({
    Player: 1, // 玩家
    Child: 2, // 小弟
    All: 3 });

//战斗状态类型
// 都可以
var BattleStatusTypes = cc.Enum({
    HpChange: 1, // 血量变化
    AttackChange: 2, // 攻击变化
    DefenceChange: 3, // 防御力变化
    CommanderChange: 4, //统帅值变化
    HpAddOrSub: 11, //血量持续增加或者减少
    Invincible: 12, //无敌
    SuckBlood: 13, //吸血
    SpeedChange: 14, //速度变化
    Dizzy: 15 });

//眩晕
module.exports = {
    BattleChildStatus: BattleChildStatus,
    SkillTargetTypes: SkillTargetTypes,
    BattleUnitTypes: BattleUnitTypes,
    BattleMoveStatus: BattleMoveStatus,
    SkillAttackTypes: SkillAttackTypes,
    BattleContactTypes: BattleContactTypes,
    BattleStatusTypes: BattleStatusTypes
};

cc._RFpop();
},{}],"WarnningNode":[function(require,module,exports){
"use strict";
cc._RFpush(module, '237bdCGvudJ6LXi5RtFEAvz', 'WarnningNode');
// Script\Battle\WarnningNode.js

cc.Class({
    "extends": cc.Component,

    properties: {},

    ///
    arc: function arc(radius, startAngle, endAngle) {
        if (cc.director.setClearColor) {
            cc.director.setClearColor(cc.Color.WHITE);
        }
        var g = this.getComponent(cc.Graphics);
        g.lineWidth = 5;
        g.fillColor = new cc.Color(255, 0, 0, 100);
        g.arc(0, 0, radius, startAngle, endAngle, true);
        g.lineTo(0, 0);
        g.close();
        g.stroke();
        g.fill();
    },

    ///
    setTime: function setTime(time) {
        var delay = cc.delayTime(time);
        var finish = cc.callFunc(this.end, this);
        this.node.runAction(cc.sequence(delay, finish));
    },

    // use this for initialization
    onLoad: function onLoad() {},

    end: function end() {
        this.poolManager.put(this.node);
    },

    onDisable: function onDisable() {
        /*
        if (cc.director.setClearColor) {
            cc.director.setClearColor( cc.Color.BLACK );
        }
        */
    }

});
// called every frame, uncomment this function to activate update callback
// update: function (dt) {

// },

cc._RFpop();
},{}],"dropobject_csv":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'e8904whTwNCMoTkXdJh+BQp', 'dropobject_csv');
// Script\Csv\dropobject_csv.js

var head = { 'id': 0, 'image': 1, 'drop_wav': 2, 'pickup_wav': 3, 'type1': 4, 'parameter1': 5, 'type2': 6, 'parameter2': 7 };

var data = [{ __d: [1001, "mercenary_25000001", "", "", 1, "1", 0, ""] }, { __d: [1002, "mercenary_99000003", "", "", 1, "2", 1, "3"] }];

module.exports = { head: head, data: data };

cc._RFpop();
},{}],"enemyteam_csv":[function(require,module,exports){
"use strict";
cc._RFpush(module, '218d14msA1H/Lrx4zevBT+d', 'enemyteam_csv');
// Script\Csv\enemyteam_csv.js

var head = { 'team_id': 0, 'team_name': 1, 'boss_team': 2, 'monster1_team': 3, 'monster2_team': 4, 'monster3_team': 5, 'monster4_team': 6, 'monster5_team': 7, 'monster6_team': 8 };

var data = [{ __d: [1, "暴民1", "", "", "", "", "", "", ""] }, { __d: [2, "暴民2", "", "", "", "", "", "", ""] }, { __d: [3, "暴民3", "", "", "", "", "", "", ""] }, { __d: [4, "暴民4", "", "", "", "", "", "", ""] }, { __d: [5, "暴民5", "", "", "", "", "", "", ""] }, { __d: [6, "暴民6", "", "", "", "", "", "", ""] }, { __d: [7, "暴民7", "", "", "", "", "", "", ""] }, { __d: [8, "暴民8", "", "", "", "", "", "", ""] }, { __d: [9, "暴民9", "", "", "", "", "", "", ""] }, { __d: [10, "暴民10", "", "", "", "", "", "", ""] }, { __d: [11, "黄巾冲击1", "", "", "", "", "", "", ""] }, { __d: [12, "黄巾冲击2", "", "", "", "", "", "", ""] }, { __d: [13, "黄巾冲击3", "", "", "", "", "", "", ""] }, { __d: [14, "黄巾冲击4", "", "", "", "", "", "", ""] }, { __d: [15, "黄巾冲击5", "", "", "", "", "", "", ""] }, { __d: [16, "黄巾冲击6", "", "", "", "", "", "", ""] }, { __d: [17, "黄巾冲击7", "", "", "", "", "", "", ""] }, { __d: [18, "黄巾冲击8", "", "", "", "", "", "", ""] }, { __d: [19, "黄巾冲击9", "", "", "", "", "", "", ""] }, { __d: [20, "黄巾冲击10", "", "", "", "", "", "", ""] }, { __d: [21, "", "", "", "", "", "", "", ""] }, { __d: [22, "", "", "", "", "", "", "", ""] }, { __d: [23, "", "", "", "", "", "", "", ""] }, { __d: [24, "", "", "", "", "", "", "", ""] }, { __d: [25, "", "", "", "", "", "", "", ""] }, { __d: [26, "", "", "", "", "", "", "", ""] }, { __d: [27, "", "", "", "", "", "", "", ""] }, { __d: [28, "", "", "", "", "", "", "", ""] }, { __d: [29, "", "", "", "", "", "", "", ""] }, { __d: [30, "", "", "", "", "", "", "", ""] }, { __d: [31, "", "", "", "", "", "", "", ""] }, { __d: [32, "", "", "", "", "", "", "", ""] }, { __d: [33, "", "", "", "", "", "", "", ""] }, { __d: [34, "", "", "", "", "", "", "", ""] }, { __d: [35, "", "", "", "", "", "", "", ""] }, { __d: [36, "", "", "", "", "", "", "", ""] }, { __d: [37, "", "", "", "", "", "", "", ""] }, { __d: [38, "", "", "", "", "", "", "", ""] }, { __d: [39, "", "", "", "", "", "", "", ""] }, { __d: [40, "", "", "", "", "", "", "", ""] }, { __d: [41, "", "", "", "", "", "", "", ""] }, { __d: [42, "", "", "", "", "", "", "", ""] }, { __d: [43, "", "", "", "", "", "", "", ""] }, { __d: [44, "", "", "", "", "", "", "", ""] }, { __d: [45, "", "", "", "", "", "", "", ""] }, { __d: [46, "", "", "", "", "", "", "", ""] }, { __d: [47, "", "", "", "", "", "", "", ""] }, { __d: [48, "", "", "", "", "", "", "", ""] }, { __d: [49, "", "", "", "", "", "", "", ""] }, { __d: [50, "", "", "", "", "", "", "", ""] }, { __d: [51, "", "", "", "", "", "", "", ""] }, { __d: [52, "", "", "", "", "", "", "", ""] }, { __d: [53, "", "", "", "", "", "", "", ""] }, { __d: [54, "", "", "", "", "", "", "", ""] }, { __d: [55, "", "", "", "", "", "", "", ""] }, { __d: [56, "", "", "", "", "", "", "", ""] }, { __d: [57, "", "", "", "", "", "", "", ""] }, { __d: [58, "", "", "", "", "", "", "", ""] }, { __d: [59, "", "", "", "", "", "", "", ""] }, { __d: [60, "", "", "", "", "", "", "", ""] }, { __d: [61, "", "", "", "", "", "", "", ""] }, { __d: [62, "", "", "", "", "", "", "", ""] }, { __d: [63, "", "", "", "", "", "", "", ""] }, { __d: [64, "", "", "", "", "", "", "", ""] }, { __d: [65, "", "", "", "", "", "", "", ""] }, { __d: [66, "", "", "", "", "", "", "", ""] }, { __d: [67, "", "", "", "", "", "", "", ""] }, { __d: [68, "", "", "", "", "", "", "", ""] }, { __d: [69, "", "", "", "", "", "", "", ""] }, { __d: [70, "", "", "", "", "", "", "", ""] }, { __d: [71, "", "", "", "", "", "", "", ""] }, { __d: [72, "", "", "", "", "", "", "", ""] }, { __d: [73, "", "", "", "", "", "", "", ""] }, { __d: [74, "", "", "", "", "", "", "", ""] }, { __d: [75, "", "", "", "", "", "", "", ""] }, { __d: [76, "", "", "", "", "", "", "", ""] }, { __d: [77, "", "", "", "", "", "", "", ""] }, { __d: [78, "", "", "", "", "", "", "", ""] }, { __d: [79, "", "", "", "", "", "", "", ""] }, { __d: [80, "", "", "", "", "", "", "", ""] }, { __d: [81, "", "", "", "", "", "", "", ""] }, { __d: [82, "", "", "", "", "", "", "", ""] }, { __d: [83, "", "", "", "", "", "", "", ""] }, { __d: [84, "", "", "", "", "", "", "", ""] }, { __d: [85, "", "", "", "", "", "", "", ""] }, { __d: [86, "", "", "", "", "", "", "", ""] }, { __d: [87, "", "", "", "", "", "", "", ""] }, { __d: [88, "", "", "", "", "", "", "", ""] }, { __d: [89, "", "", "", "", "", "", "", ""] }, { __d: [90, "", "", "", "", "", "", "", ""] }, { __d: [91, "", "", "", "", "", "", "", ""] }, { __d: [92, "", "", "", "", "", "", "", ""] }, { __d: [93, "", "", "", "", "", "", "", ""] }, { __d: [94, "", "", "", "", "", "", "", ""] }, { __d: [95, "", "", "", "", "", "", "", ""] }, { __d: [96, "", "", "", "", "", "", "", ""] }, { __d: [97, "", "", "", "", "", "", "", ""] }, { __d: [98, "", "", "", "", "", "", "", ""] }, { __d: [99, "", "", "", "", "", "", "", ""] }, { __d: [100, "", "", "", "", "", "", "", ""] }];

module.exports = { head: head, data: data };

cc._RFpop();
},{}],"general_csv":[function(require,module,exports){
"use strict";
cc._RFpush(module, '6c260M2Sr5LUr73+jaxrIb+', 'general_csv');
// Script\Csv\general_csv.js

var head = { 'id': 0, 'general_id': 1, 'monster_id': 2, 'general_name': 3, 'general_star': 4, 'exp': 5, 'up_star_id': 6, 'up_star_num': 7, 'update_id': 8, 'to_exp': 9, 'need_commander': 10, 'output': 11, 'attack': 12, 'defense': 13 };

var data = [{ __d: [2001, 2001, 2001, "关二习", 1, 100, 0, 0, 2002, 100, 30, 1000, 150, 100] }, { __d: [2002, 2001, 2001, "关二习", 2, 200, 0, 0, 2003, 200, 35, 2000, 200, 120] }, { __d: [2003, 2001, 2001, "关二习", 3, 400, 0, 0, 2004, 400, 40, 3000, 250, 140] }, { __d: [2004, 2001, 2001, "关二习", 4, 800, 0, 0, 2005, 800, 45, 4000, 300, 160] }, { __d: [2005, 2001, 2001, "关二习", 5, 0, 2005, 1, 2006, -1, 50, 5000, 350, 180] }, { __d: [2006, 2001, 2001, "关二习", 6, 0, 2006, 1, 2007, -1, 55, 6000, 400, 200] }, { __d: [2007, 2001, 2001, "关二习", 7, 0, 2007, 1, 2008, -1, 60, 7000, 450, 220] }, { __d: [2008, 2001, 2001, "关二习", 8, 0, 2008, 1, 2009, -1, 65, 8000, 500, 240] }, { __d: [2009, 2001, 2001, "关二习", 9, 0, 2009, 1, 2010, -1, 70, 9000, 550, 260] }, { __d: [2010, 2001, 2001, "关二习", 10, 0, 0, 0, -1, -1, 75, 10000, 600, 280] }];

module.exports = { head: head, data: data };

cc._RFpop();
},{}],"house_csv":[function(require,module,exports){
"use strict";
cc._RFpush(module, '04d5csiQ15PALX6kUY9005L', 'house_csv');
// Script\Csv\house_csv.js

var head = { 'house_type': 0, 'monster_id': 1, 'house_name': 2, 'house_lv': 3, 'need_money': 4, 'boom': 5, 'output': 6, 'defense': 7, 'remove_money': 8 };

var data = [{ __d: [4001, 4001, "村长家", 1, 1000, 50, 1000, 100, 100] }, { __d: [4001, 4001, "村长家", 2, 10000, 70, 2000, 200, 1000] }, { __d: [4001, 4001, "村长家", 3, 20000, 100, 3000, 300, 2000] }, { __d: [4001, 4001, "村长家", 4, 30000, 150, 4000, 400, 3000] }, { __d: [4001, 4001, "村长家", 5, 40000, 200, 5000, 500, 4000] }, { __d: [4001, 4001, "村长家", 6, 50000, 300, 6000, 600, 5000] }, { __d: [4001, 4001, "村长家", 7, 60000, 400, 7000, 700, 6000] }, { __d: [4001, 4001, "村长家", 8, 70000, 500, 8000, 800, 7000] }, { __d: [4001, 4001, "村长家", 9, 80000, 700, 9000, 900, 8000] }, { __d: [4001, 4001, "村长家", 10, 90000, 1000, 10000, 1000, 9000] }, { __d: [4101, 4101, "民居", 1, 500, 10, 500, 50, 50] }, { __d: [4101, 4101, "民居", 2, 1000, 20, 800, 60, 100] }, { __d: [4101, 4101, "民居", 3, 2000, 30, 1100, 70, 200] }, { __d: [4101, 4101, "民居", 4, 3000, 40, 1400, 80, 300] }, { __d: [4101, 4101, "民居", 5, 4000, 50, 1700, 90, 400] }, { __d: [4101, 4101, "民居", 6, 5000, 60, 2000, 100, 500] }, { __d: [4101, 4101, "民居", 7, 6000, 70, 2300, 110, 600] }, { __d: [4101, 4101, "民居", 8, 7000, 80, 2600, 120, 700] }, { __d: [4101, 4101, "民居", 9, 8000, 90, 2900, 130, 800] }, { __d: [4101, 4101, "民居", 10, 9000, 100, 3200, 140, 900] }, { __d: [4201, 4201, "酒楼", 1, 800, 20, 800, 50, 80] }, { __d: [4201, 4201, "酒楼", 2, 1600, 40, 1200, 70, 160] }, { __d: [4201, 4201, "酒楼", 3, 3200, 60, 1600, 90, 320] }, { __d: [4201, 4201, "酒楼", 4, 5000, 80, 2000, 110, 500] }, { __d: [4201, 4201, "酒楼", 5, 10000, 100, 2400, 130, 1000] }, { __d: [4201, 4201, "酒楼", 6, 20000, 120, 2800, 150, 2000] }, { __d: [4201, 4201, "酒楼", 7, 30000, 140, 3200, 170, 3000] }, { __d: [4201, 4201, "酒楼", 8, 40000, 160, 3600, 190, 4000] }, { __d: [4201, 4201, "酒楼", 9, 50000, 180, 4000, 210, 5000] }, { __d: [4201, 4201, "酒楼", 10, 60000, 200, 4400, 230, 6000] }];

module.exports = { head: head, data: data };

cc._RFpop();
},{}],"house_open_csv":[function(require,module,exports){
"use strict";
cc._RFpush(module, '47dfeHJxYdFEb/rpeV0uoUu', 'house_open_csv');
// Script\Csv\house_open_csv.js

var head = { 'house_id': 0, 'house_type': 1, 'house_name': 2, 'house_position': 3, 'open_type': 4, 'open_req': 5, 'open_des': 6 };

var data = [{ __d: [4001, 4001, "村长家", 1, 0, 0, ""] }, { __d: [4101, 4101, "民居", 1, 1, 1, "村长家1级"] }, { __d: [4102, 4101, "民居", 2, 1, 2, "村长家2级"] }, { __d: [4103, 4101, "民居", 3, 1, 3, "村长家3级"] }, { __d: [4104, 4101, "民居", 4, 1, 4, "村长家4级"] }, { __d: [4105, 4101, "民居", 5, 1, 5, "村长家5级"] }, { __d: [4106, 4101, "民居", 6, 1, 6, "村长家6级"] }, { __d: [4107, 4101, "民居", 7, 1, 7, "村长家7级"] }, { __d: [4108, 4101, "民居", 8, 1, 8, "村长家8级"] }, { __d: [4109, 4101, "民居", 9, 1, 9, "村长家9级"] }, { __d: [4110, 4101, "民居", 10, 1, 10, "村长家10级"] }, { __d: [4201, 4201, "酒楼", 1, 1, 3, "村长家3级"] }, { __d: [4202, 4201, "酒楼", 2, 1, 5, "村长家5级"] }, { __d: [4203, 4201, "酒楼", 3, 1, 7, "村长家7级"] }];

module.exports = { head: head, data: data };

cc._RFpop();
},{}],"item_csv":[function(require,module,exports){
"use strict";
cc._RFpush(module, '5b7044bpClJQ5Er40EqjOig', 'item_csv');
// Script\Csv\item_csv.js

var head = { 'item_id': 0, 'name': 1, 'des1': 2, 'icon': 3, 'item_type': 4, 'stack': 5, 'quality': 6 };

var data = [{ __d: [1, "元宝", "珍贵异常，可购买很多稀有道具", "", 0, 0, 2] }, { __d: [2, "铜钱", "用途广泛的通用货币", "", 0, 0, 4] }, { __d: [3, "繁荣度", "城市繁荣的象征", "", 0, 0, 4] }, { __d: [11, "村民", "能提升村子的税收", "", 0, 0, 1] }, { __d: [2001, "关二习", "三国名将关二习", "", 1, 1, 3] }, { __d: [2002, "关二习", "三国名将关二习", "", 1, 1, 3] }, { __d: [2003, "关二习", "三国名将关二习", "", 1, 1, 3] }, { __d: [2004, "关二习", "三国名将关二习", "", 1, 1, 3] }, { __d: [2005, "关二习", "三国名将关二习", "", 1, 1, 3] }, { __d: [2006, "关二习", "三国名将关二习", "", 1, 1, 3] }, { __d: [2007, "关二习", "三国名将关二习", "", 1, 1, 3] }, { __d: [2008, "关二习", "三国名将关二习", "", 1, 1, 3] }, { __d: [2009, "关二习", "三国名将关二习", "", 1, 1, 3] }, { __d: [2010, "关二习", "三国名将关二习", "", 1, 1, 3] }, { __d: [3001, "农民", "一个老实巴交的普通农民", "", 2, 9999, 1] }, { __d: [3002, "农民", "一个老实巴交的普通农民，气血比较足", "", 2, 9999, 2] }, { __d: [3003, "农民", "一个老实巴交的普通农民，气血充盈", "", 2, 9999, 3] }, { __d: [3004, "农民", "一个老实巴交的普通农民，或许得到过什么奇遇", "", 2, 9999, 4] }, { __d: [3011, "地痞", "地痞流氓", "", 2, 9999, 1] }, { __d: [3012, "地痞", "地痞流氓，最好别招惹", "", 2, 9999, 2] }, { __d: [3013, "地痞", "地痞流氓，练过几手", "", 2, 9999, 3] }, { __d: [3014, "地痞", "地痞流氓，“流氓拳”小成", "", 2, 9999, 4] }, { __d: [3021, "老头", "一个普通的老人", "", 2, 9999, 1] }, { __d: [3022, "老头", "略显强壮的老人", "", 2, 9999, 2] }, { __d: [3023, "老头", "这个老人似乎练过", "", 2, 9999, 3] }, { __d: [3024, "老头", "“一派宗师”之相，拉出去当骗子肯定能得手", "", 2, 9999, 4] }];

module.exports = { head: head, data: data };

cc._RFpop();
},{}],"lead_csv":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'ba8ffEnuTBKO4oOcCiwA3Lg', 'lead_csv');
// Script\Csv\lead_csv.js

var head = { 'office_id': 0, 'office_name': 1, 'need_boom': 2, 'update_id': 3, 'speed': 4, 'control_range': 5, 'commander': 6, 'initial_output': 7, 'growth_output': 8, 'initial_attack': 9, 'growth_attack': 10, 'initial_defense': 11, 'growth_defense': 12 };

var data = [{ __d: [1001, "渣渣村长", 100, 1002, 140, 300, 50, 1000, 100, 150, 15, 100, 10] }, { __d: [1002, "沙雕村长", 200, 1003, 140, 300, 80, 2000, 200, 200, 20, 120, 12] }, { __d: [1003, "捡币村长", 500, 1004, 140, 300, 110, 3000, 300, 250, 25, 140, 14] }, { __d: [1004, "普通村长", 1000, 1005, 140, 300, 140, 4000, 400, 300, 30, 160, 16] }, { __d: [1005, "精英村长", 1500, 1006, 140, 300, 170, 5000, 500, 350, 35, 180, 18] }, { __d: [1006, "史诗村长", 2000, 1007, 140, 300, 200, 6000, 600, 400, 40, 200, 20] }, { __d: [1007, "传奇村长", 0, -1, 140, 300, 230, 7000, 700, 450, 45, 220, 22] }];

module.exports = { head: head, data: data };

cc._RFpop();
},{}],"lead_exp_csv":[function(require,module,exports){
"use strict";
cc._RFpush(module, '6cc0cvZ2MRF85N21i4rfRd7', 'lead_exp_csv');
// Script\Csv\lead_exp_csv.js

var head = { 'lead_lv': 0, 'exp': 1 };

var data = [{ __d: [1, 16] }, { __d: [2, 29] }, { __d: [3, 44] }, { __d: [4, 61] }, { __d: [5, 80] }, { __d: [6, 101] }, { __d: [7, 124] }, { __d: [8, 149] }, { __d: [9, 176] }, { __d: [10, 205] }, { __d: [11, 236] }, { __d: [12, 269] }, { __d: [13, 304] }, { __d: [14, 341] }, { __d: [15, 380] }, { __d: [16, 421] }, { __d: [17, 464] }, { __d: [18, 509] }, { __d: [19, 556] }, { __d: [20, 605] }, { __d: [21, 656] }, { __d: [22, 709] }, { __d: [23, 764] }, { __d: [24, 821] }, { __d: [25, 880] }, { __d: [26, 941] }, { __d: [27, 1004] }, { __d: [28, 1069] }, { __d: [29, 1136] }, { __d: [30, 1205] }, { __d: [31, 1276] }, { __d: [32, 1349] }, { __d: [33, 1424] }, { __d: [34, 1501] }, { __d: [35, 1580] }, { __d: [36, 1661] }, { __d: [37, 1744] }, { __d: [38, 1829] }, { __d: [39, 1916] }, { __d: [40, 2005] }, { __d: [41, 2096] }, { __d: [42, 2189] }, { __d: [43, 2284] }, { __d: [44, 2381] }, { __d: [45, 2480] }, { __d: [46, 2581] }, { __d: [47, 2684] }, { __d: [48, 2789] }, { __d: [49, 2896] }, { __d: [50, 3005] }, { __d: [51, 3116] }, { __d: [52, 3229] }, { __d: [53, 3344] }, { __d: [54, 3461] }, { __d: [55, 3580] }, { __d: [56, 3701] }, { __d: [57, 3824] }, { __d: [58, 3949] }, { __d: [59, 4076] }, { __d: [60, 4205] }, { __d: [61, 4336] }, { __d: [62, 4469] }, { __d: [63, 4604] }, { __d: [64, 4741] }, { __d: [65, 4880] }, { __d: [66, 5021] }, { __d: [67, 5164] }, { __d: [68, 5309] }, { __d: [69, 5456] }, { __d: [70, 5605] }, { __d: [71, 5756] }, { __d: [72, 5909] }, { __d: [73, 6064] }, { __d: [74, 6221] }, { __d: [75, 6380] }, { __d: [76, 6541] }, { __d: [77, 6704] }, { __d: [78, 6869] }, { __d: [79, 7036] }, { __d: [80, 7205] }, { __d: [81, 7376] }, { __d: [82, 7549] }, { __d: [83, 7724] }, { __d: [84, 7901] }, { __d: [85, 8080] }, { __d: [86, 8261] }, { __d: [87, 8444] }, { __d: [88, 8629] }, { __d: [89, 8816] }, { __d: [90, 9005] }, { __d: [91, 9196] }, { __d: [92, 9389] }, { __d: [93, 9584] }, { __d: [94, 9781] }, { __d: [95, 9980] }, { __d: [96, 10181] }, { __d: [97, 10384] }, { __d: [98, 10589] }, { __d: [99, 10796] }, { __d: [100, 11005] }];

module.exports = { head: head, data: data };

cc._RFpop();
},{}],"monster_csv":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'dbf89mmgVZBKbRM1BqqONsX', 'monster_csv');
// Script\Csv\monster_csv.js

var head = { 'monster_id': 0, 'name': 1, 'monster_type': 2, 'group': 3, 'special_avoid': 4, 'life_time': 5, 'resource_type': 6, 'resource_name': 7, 'dead_effect': 8, 'zoom': 9, 'birth_sound': 10, 'dead_sound': 11, 'hurt_sound': 12, 'speed': 13, 'warning_range': 14, 'fix_hurt_hp': 15, 'hp_num': 16, 'skill_order': 17, 'attack_skillid': 18, 'skill_id1': 19, 'skill_trigger1': 20, 'skill_par1': 21, 'skill_num1': 22, 'skill_id2': 23, 'skill_trigger2': 24, 'skill_par2': 25, 'skill_num2': 26, 'skill_id3': 27, 'skill_trigger3': 28, 'skill_par3': 29, 'skill_num3': 30, 'drop_object': 31, 'drop_num': 32, 'exp': 33, 'drop_item': 34, 'drop_item_num': 35 };

var data = [{ __d: [101, "男主角", 1, 0, "", 0, 2, "zhujue", "", 1, "", "", "", 0, 0, 0, 0, "", 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, "", 0, 0, 0, 0] }, { __d: [2001, "关二习", 2, 0, "", 0, 2, "1wujiang", "", 1, "", "", "", 135, 100, 0, 3, "", 201, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, "", 0, 100, 2001, 1] }, { __d: [3001, "农民", 2, 0, "", 0, 2, "1meizi", "", 1, "", "", "", 100, 100, 0, 1, "", 101, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, "", 0, 20, 2, 1000] }, { __d: [3011, "地痞", 2, 0, "", 0, 2, "2meizi", "", 1, "", "", "", 120, 120, 0, 1, "", 102, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, "", 0, 20, 2, 50] }, { __d: [3021, "老头", 2, 0, "", 0, 2, "3meizi", "", 1, "", "", "", 90, 90, 0, 1, "", 103, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, "", 0, 20, 2, 80] }, { __d: [4001, "村长家", 3, 0, "", 0, 2, "", "", 1, "", "", "", 0, 0, 0, 1, "", 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, "[1001;10000]", 1, 0, 0, 0] }, { __d: [4101, "民居", 3, 0, "", 0, 2, "", "", 1, "", "", "", 0, 0, 0, 1, "", 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, "[1001;5000];[1002;5000]", 3, 0, 0, 0] }, { __d: [4201, "酒楼", 3, 0, "", 0, 2, "", "", 1, "", "", "", 0, 0, 0, 1, "", 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, "[1002;10000]", 1, 0, 0, 0] }];

module.exports = { head: head, data: data };

cc._RFpop();
},{}],"monster_value_csv":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'da5fcXBquFCj76k5SuhA3ab', 'monster_value_csv');
// Script\Csv\monster_value_csv.js

var head = { 'monster_id': 0, 'name': 1, 'initial_output': 2, 'growth_output': 3, 'initial_attack': 4, 'growth_attack': 5, 'initial_defense': 6, 'growth_defense': 7 };

var data = [{ __d: [2001, "关二习", 1000, 100, 150, 15, 100, 10] }, { __d: [3001, "农民", 2000, 200, 200, 20, 120, 12] }, { __d: [3011, "地痞", 3000, 300, 250, 25, 140, 14] }, { __d: [3021, "老头", 4000, 400, 300, 30, 160, 16] }];

module.exports = { head: head, data: data };

cc._RFpop();
},{}],"skill_csv":[function(require,module,exports){
"use strict";
cc._RFpush(module, '7c423ICH9JBjpOdmgQAQ3nS', 'skill_csv');
// Script\Csv\skill_csv.js

var head = { 'id': 0, 'name': 1, 'type': 2, 'fire_pos_type': 3, 'distance': 4, 'fire_effect': 5, 'hit_effect': 6, 'fire_sound': 7, 'hit_sound': 8, 'fire_say': 9, 'repel_pro': 10, 'skill_score': 11, 'des': 12, 'cd': 13, 'public_cd': 14, 'target_type': 15, 'fan_angle': 16, 'sector_radius': 17, 'dis_range': 18, 'coea': 19, 'coeb': 20, 'power_duration': 21 };

var data = [{ __d: [101, "小兵攻击1s", 1, 2, 50, "", "", "", "", "", 0, "", "", 1000, 0, 2, 0, 0, 0, 1, 0, 0] }, { __d: [102, "小兵攻击0.7s", 1, 2, 50, "", "", "", "", "", 0, "", "", 700, 0, 2, 0, 0, 0, 1, 0, 0] }, { __d: [103, "小兵攻击0.5s", 1, 2, 50, "", "", "", "", "", 0, "", "", 500, 0, 2, 0, 0, 0, 1, 0, 0] }, { __d: [201, "武将攻击", 3, 2, 200, "", "", "", "", "say#0:吃我一刀!#1:小子休走！", 2000, "", "", 400, 0, 2, 20, 30, 1, 1, 0, 200] }];

module.exports = { head: head, data: data };

cc._RFpop();
},{}],"soldier_csv":[function(require,module,exports){
"use strict";
cc._RFpush(module, '1e3f5drZJRG4ID4ZtW640qM', 'soldier_csv');
// Script\Csv\soldier_csv.js

var head = { 'item_id': 0, 'soldier_id': 1, 'monster_id': 2, 'soldier_name': 3, 'need_commander': 4, 'per_output': 5, 'per_attack': 6, 'per_defense': 7 };

var data = [{ __d: [3001, 3001, 3001, "农民", 4, 1000, 8000, 2000] }, { __d: [3002, 3002, 3001, "农民", 4, 1500, 8000, 2000] }, { __d: [3003, 3003, 3001, "农民", 4, 2000, 8000, 2000] }, { __d: [3004, 3004, 3001, "农民", 4, 2500, 8000, 2000] }, { __d: [3011, 3011, 3011, "地痞", 6, 1500, 9600, 2000] }, { __d: [3012, 3012, 3011, "地痞", 6, 1500, 9600, 2400] }, { __d: [3013, 3013, 3011, "地痞", 6, 1500, 9600, 2800] }, { __d: [3014, 3014, 3011, "地痞", 6, 1500, 9600, 3200] }, { __d: [3021, 3021, 3021, "老头", 4, 800, 6400, 2400] }, { __d: [3022, 3022, 3021, "老头", 4, 1000, 6400, 2500] }, { __d: [3023, 3023, 3021, "老头", 4, 1200, 6400, 2600] }, { __d: [3024, 3024, 3021, "老头", 4, 1400, 6400, 2700] }];

module.exports = { head: head, data: data };

cc._RFpop();
},{}],"status_csv":[function(require,module,exports){
"use strict";
cc._RFpush(module, '9f54doz3bdLIYuclAqu4GUS', 'status_csv');
// Script\Csv\status_csv.js

var head = { 'id': 0, 'name': 1, 'release_music': 2, 'effect_name': 3, 'is_pass': 4, 'effect_pos': 5, 'time': 6, 'max_time': 7, 'interval': 8, 'type': 9, 'percentage': 10, 'value': 11, 'say': 12, 'particle': 13 };

var data = [{ __d: [1, "肉回血", "", "hj_buffjiaxue", 0, 2, 1000, 0, 600, 11, "1000", 0, "", 0] }, { __d: [2, "馊水降攻击", "", "hj_buffzhongdu", 1, 2, 10000, 20000, 0, 2, "-2000", 0, "", 0] }, { __d: [3, "馊水降防御", "", "", 1, 2, 10000, 20000, 0, 3, "", -5, "", 0] }];

module.exports = { head: head, data: data };

cc._RFpop();
},{}],"status":[function(require,module,exports){
"use strict";
cc._RFpush(module, '32a39LnTutHCJ+xpr/vwWdZ', 'status');
// Script\Csv\status.js

var head = { 'id': 0, 'name': 1, 'release_music': 2, 'effect_name': 3, 'effect_pos': 4, 'time': 5, 'max_time': 6, 'interval': 7, 'type': 8, 'per_speed': 9, 'per_hurt': 10, 'hurt': 11, 'per_addhp': 12, 'per_output': 13, 'output': 14, 'per_attack': 15, 'attack': 16, 'per_defense': 17, 'defense': 18, 'say': 19, 'particle': 20 };

var data = [{ __d: [1, "肉回血", "", "", 2, 1000, 0, 600, 11, 0, 1000, 0, 0, 0, 0, 0, 0, 0, 0, "", 0] }, { __d: [2, "馊水降血上限", "", "", 2, 10000, 20000, 0, 1, 0, 0, 0, 0, 2000, 0, 0, 0, 0, 0, "", 0] }, { __d: [3, "馊水降攻击", "", "", 2, 10000, 20000, 0, 2, 0, 0, 0, 0, 0, 0, 2000, 0, 0, 0, "", 0] }, { __d: [4, "馊水降防御", "", "", 2, 10000, 20000, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 2000, 0, "", 0] }];

module.exports = { head: head, data: data };

cc._RFpop();
},{}]},{},["TouchPoint","house_csv","OnTouchCtrl","BattleBuffManager","BattleChild","BattleHouse","BattleMain","soldier_csv","enemyteam_csv","GameOver","WarnningNode","HelloWorld","status","BattleSkillManager","BattleDrop","house_open_csv","BattleBubble","HouseHurtEffect","item_csv","BattleCtrl","general_csv","lead_exp_csv","skill_csv","ActionHelper","BattlePlayer","status_csv","GameStart","MathHelper","BattlePopTalk","MapManager","lead_csv","Effect","BattleUnitDataManager","Init","monster_csv","monster_value_csv","dropobject_csv","CsvLoader","BattleContactManager","Types","BattleMoveManager","BattleGeneral"]);
