import { GameObjects, Scene } from 'phaser';
import { assetName } from '../data/assetName';
// import { quotes } from '../data/quotes';
import { randomMinMax } from '../data/randomMinMax';
import { gameConfig } from '../data/gameConfig';
// import { EventBus } from '../EventBus';

export class Game extends Scene {
    // background: GameObjects.Image;
    // logo: GameObjects.Image
    // title: GameObjects.Text;
    // logoTween: Phaser.Tweens.Tween | null;


    //* object sprite */
    waterMoodeng: boolean;
    spriteCursur: GameObjects.Image;
    spriteWaterLine: GameObjects.Image;
    spriteMoodeng: GameObjects.Image;
    spriteSplash: GameObjects.Sprite;

    //* collision */
    graphicsBoundWater: Phaser.GameObjects.Graphics;
    graphicsBoundMoodeng: Phaser.GameObjects.Graphics;
    boundMoodeng: Phaser.Geom.Rectangle;
    boundWater: Phaser.Geom.Rectangle;

    //* config */
    // targetScore: number;
    // timeLimit: number;

    //* ui */
    score: number;
    timer: number;
    difficulty: number;
    gameOver: boolean;
    gameStart: boolean;
    pointerDown: boolean;
    txtScore: Phaser.GameObjects.Text
    txtTimer: Phaser.GameObjects.Text
    txtRound: Phaser.GameObjects.Text
    txtDebug: Phaser.GameObjects.Text
    // spriteUpgrade: GameObjects.Image;


    //* animation */
    // moodengState: number; // 0:stop 1:stay 2:run

    constructor() {
        super('Game');
    }

    init() {
        this.difficulty = 1
        this.score = 0
        this.registry.set({ registryDifficulty: 1, registryScore: 0 })

        this.timer = gameConfig.timeLimit
        this.gameOver = false
        this.gameStart = false
    }

    create() {
        //* start */
        console.time();

        //* set defualt var
        const gameWidth = this.sys.canvas.width
        const gameHeight = this.sys.canvas.height
        const deadZone = gameConfig.deadZone;
        // this.sound.pauseOnBlur = false;
        console.log({ areaWidth: gameWidth, areaHeight: gameHeight });

        //*add sprite
        this.spriteCursur = this.add.image(gameWidth - 200, gameHeight / 2 - 300, 'hose').setOrigin(0, 0.5).setDepth(100).setAngle(70).setScale(2).setInteractive({ draggable: true })
        this.spriteWaterLine = this.add.image(0, 0, 'water').setOrigin(1, 0.5).setVisible(false).setDepth(100).setAngle(70).setScale(2)
        this.spriteMoodeng = this.add.image(gameWidth / 2 - randomMinMax(0, 100), gameHeight / 2 - randomMinMax(0, 200), 'md-run')
        this.spriteSplash = this.add.sprite(-999, -999, 'atlas-water-splash').setScale(3)
        // const spriteHand = this.add.image(0, 0, 'arm').setScale(0.5).setDepth(101).setVisible(false).setAngle(45)
        this.anims.create({
            key: 'anim-water-splash', frames: this.anims.generateFrameNames('atlas-water-splash',
                { prefix: 'water-splash-', start: 1, end: 3, suffix: '.png' }), repeat: -1, frameRate: 10
        });

        this.spriteSplash.play('anim-water-splash')

        //*add bound
        this.boundMoodeng = new Phaser.Geom.Rectangle(0, 0, this.spriteMoodeng.width - 80, this.spriteMoodeng.height - 80)
        // this.boundWater = this.spriteSplash.getBounds()
        this.boundWater = new Phaser.Geom.Rectangle(0, 0, this.spriteSplash.width, this.spriteSplash.height)
        this.graphicsBoundWater = this.add.graphics({ fillStyle: { color: 0xaa0000, alpha: 0.5 } });
        this.graphicsBoundMoodeng = this.add.graphics({ fillStyle: { color: 0xaaff00, alpha: 0.5 } });

        //*drag event
        this.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
            if (this.pointerDown) {
                this.spriteCursur.setX(pointer.x - 50)
                this.spriteCursur.setY(pointer.y - 150)
                this.spriteWaterLine.setVisible(true)
                this.spriteWaterLine.x = this.spriteCursur.x
                this.spriteWaterLine.y = this.spriteCursur.y
                this.spriteSplash.setPosition(this.spriteWaterLine.x - this.spriteWaterLine.width + 35, this.spriteWaterLine.y - this.spriteWaterLine.height - 260)
            } else {
                this.spriteWaterLine.setVisible(false)
                this.spriteSplash.setPosition(-999, -999)
            }
        })

        this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
            this.pointerDown = true
            this.spriteCursur.setX(pointer.x - 50)
            this.spriteCursur.setY(pointer.y - 150)
        })

        this.input.on('pointerup', () => {
            this.pointerDown = false
            this.spriteWaterLine.setVisible(false)
            this.spriteSplash.setPosition(-999, -999)

        })


        //* move moodeng */

        const startMoodengRunning = (spriteRunning: GameObjects.Image) => {
            const targetX = spriteRunning.x <= gameWidth / 2 ? randomMinMax(gameWidth - deadZone - 300, gameWidth - deadZone - 100) : randomMinMax(deadZone + 100, deadZone + 300);
            const targetY = randomMinMax(deadZone + 200, gameHeight - deadZone - 400);

            const distanceAndDuration = Math.sqrt(Math.pow(targetX - spriteRunning.x, 2) + Math.pow(targetY - spriteRunning.y, 2)) - 100

            const tweenRun = this.tweens.add({
                targets: spriteRunning,
                delay: 1000,
                x: { value: targetX, duration: distanceAndDuration },
                y: { value: targetY, duration: distanceAndDuration },
                // },
                // ease: 'Quint.easeInOut',
                easeParams: '',
                onStart: () => {
                    spriteRunning.setTexture('md-run').setFlipX(targetX < spriteRunning.x)
                },
                onComplete: () => {
                    moodengWaiting(spriteRunning)
                },
            });
            tweenRun.setTimeScale(this.difficulty)

        }

        const moodengWaiting = (spriteRunning: GameObjects.Image) => {
            if (this.score >= gameConfig.targetScore) {
                //*game complete
                spriteRunning.setTexture('md-front')


                //*restart
                handleGameOver(false)
            }
            else
                if (!(this.gameOver)) {
                    //*game still running
                    spriteRunning.setTexture('md-angry').setFlipX(spriteRunning.x > 500)
                    this.sound.add('select').play()
                    startMoodengRunning(spriteRunning)

                }

                else
                    if (this.gameOver) {
                        //*game over
                        spriteRunning.setTexture('md-bite')
                        handleGameOver(true)
                    }
        }

        const handleGameOver = (ending: boolean) => {
            //* before decision
            this.registry.set('registryScore', this.registry.get('registryScore') ? this.registry.get('registryScore') + this.score : this.score) // add score

            if (!ending) {
                //* new game
                newRound()
            } else {
                this.registry.set('registryDifficulty', this.difficulty)
                //* game over
                console.timeEnd();
                this.scene.start('GameOver');

            }

            //* after decision
            console.log(ending ? ' game over' : `new game`, { score: this.registry.get('registryScore'), round: this.registry.get('registryDifficulty') });
        }

        const spriteNewRoundMD = this.add.image(gameWidth - 500, gameHeight - 450, 'md-angry').setDepth(999).setScale(2).setOrigin(0).setVisible(false)
        const spriteNewRoundMK = this.add.image(gameWidth - 500, gameHeight - 450, 'mark').setDepth(998).setScale(2).setOrigin(0).setVisible(false)
        // .setVisible(false)
        // const geomeUpgrade = new Phaser.GameObjects.Rectangle(0, 0, this.spriteSplash.width, this.spriteSplash.height)
        const newRound = () => {
            spriteNewRoundMD.setAlpha(1).setVisible(true)
            spriteNewRoundMK.setAlpha(1).setVisible(true)
            this.tweens.add({
                targets: [spriteNewRoundMD, spriteNewRoundMK],
                startDelay: 200,
                alpha: 0,
                easeParams: '',
                onStart: () => {
                },
                onComplete: () => {
                    this.registry.set('registryDifficulty', this.difficulty + gameConfig.difficultyAdjust); // add difficulty
                    this.difficulty = this.registry.get('registryDifficulty') // get difficulty
                    this.score = 0
                    this.timer = gameConfig.timeLimit
                    this.gameOver = false
                    startMoodengRunning(this.spriteMoodeng)
                },
            });
        }


        //*start game
        this.spriteMoodeng.setTexture('md-front')

        const textStart = this.add.text(gameWidth + 1200, gameHeight / 2 - 350, `Ready?`, {
            fontFamily: 'Arial Black', fontSize: 600, color: '#ffffff',
            stroke: '#000000', strokeThickness: 10,
            align: 'center'
        }).setOrigin(0.5, 0.5).setDepth(1000)

        this.tweens.add({
            targets: textStart,
            x: -1000,
            delay: 500,
            duration: 2000,
            onComplete: () => {
                textStart.setText('Go!').setAlpha(1).setX(gameWidth + 1000)
                this.tweens.add({
                    targets: textStart,
                    // start: false,
                    delay: 1000,
                    x: -1000,
                    duration: 1000,
                    onComplete: () => {
                        this.gameStart = true
                        this.timer = gameConfig.timeLimit
                        startMoodengRunning(this.spriteMoodeng)
                    }
                });
            }
        });



        // startMoodengRunning(this.spriteMoodeng)

        //* debug */
        assetName.single.map((name, index) => {
            const order = (index % 2 == 1) ? 2400 : 2600

            this.add.image(50 + 120 * index, order, name).setScale(0.25, 0.25)
            this.add.text(0 + 120 * index, order + 40, name,).setScale(3)
        })
        this.txtScore = this.add.text(10, 20, '').setScale(3)
        this.txtTimer = this.add.text(800, 20, '').setScale(3)
        this.txtRound = this.add.text(10, 80, '').setScale(3)
        this.txtDebug = this.add.text(10, 140, '').setScale(3)
        console.log({ difficulty: this.difficulty });

        const debugMarginGeom = new Phaser.Geom.Rectangle(deadZone, deadZone, gameWidth - deadZone * 2, gameHeight - deadZone * 2)
        this.add.graphics().lineStyle(2, 0xff0000).strokeRectShape(debugMarginGeom);

        // EventBus.emit('current-scene-ready', this);

        console.log(window.AudioContext);

    }

    update() {
        if (this.gameStart) {

            this.timer > 0 ? this.timer -= 1 : (this.gameOver = true, this.timer = 0)
        }
        this.txtScore.setText(`score : ${this.score} ,regisScore ${this.registry.get('registryScore')}`)
        this.txtTimer.setText(`timer : ${this.timer}`)
        this.txtRound.setText(`diff : ${this.difficulty},regis ${this.registry.get('registryDifficulty')}, round ${this.difficulty * 2 - 1}`)
        this.txtDebug.setText(`pointer x : ${this.spriteCursur.x}  y : ${this.spriteCursur.y}`)

        //*set waterBound on waterSprite
        Phaser.Geom.Rectangle.CenterOn(this.boundWater, this.spriteSplash.getCenter().x, this.spriteSplash.getCenter().y)
        Phaser.Geom.Rectangle.CenterOn(this.boundMoodeng, this.spriteMoodeng.getCenter().x, this.spriteMoodeng.getCenter().y)

        if (!(this.gameOver) && this.gameStart && Phaser.Geom.Intersects.RectangleToRectangle(this.boundMoodeng, this.boundWater) && this.score < gameConfig.targetScore) {
            this.score += 1
        }

        if (Phaser.Geom.Intersects.RectangleToRectangle(this.boundMoodeng, this.boundWater)) {
            //* this.spriteSplash.play('anim-water-splash')
            this.spriteSplash.setVisible(true)
        } else {
            this.spriteSplash.setVisible(false)
            //* this.spriteSplash.stop()
        }

        //*show graphic
        this.graphicsBoundWater.clear();
        this.graphicsBoundWater.lineStyle(5, 0x00ccff)
        this.graphicsBoundWater.strokeRectShape(this.boundWater);

        this.graphicsBoundMoodeng.clear();
        this.graphicsBoundMoodeng.lineStyle(5, 0xffaa20);
        this.graphicsBoundMoodeng.strokeRectShape(this.boundMoodeng)


        //* debug sound */
        //         if (game.sound.context.state === 'suspended') {
        //             game.sound.context.resume();
        // }
    }

}
