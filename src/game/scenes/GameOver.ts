import { quotes } from '../data/quotes';
import { randomMinMax } from '../data/randomMinMax';
// import { EventBus } from '../EventBus';
import { Scene } from 'phaser';

export class GameOver extends Scene {
    camera: Phaser.Cameras.Scene2D.Camera;
    // background: Phaser.GameObjects.Image;
    // gameOverText: Phaser.GameObjects.Text;

    constructor() {
        super('GameOver');
    }

    create() {
        this.scene.stop('Game');

        const gameWidth = this.sys.canvas.width
        const gameHeight = this.sys.canvas.height

        this.camera = this.cameras.main
        this.camera.setBackgroundColor(0x801111);

        const textConfig = {
            fontFamily: 'Arial Black', fontSize: 64, color: '#ffffff',
            stroke: '#000000', strokeThickness: 10,
            align: 'center'
        }

        const quotesIndex = randomMinMax(0, quotes.length - 1)
        console.log({ quotesIndex, quotes: quotes[quotesIndex] });


        this.add.text(gameWidth / 2, 200, `Game Over`, textConfig).setOrigin(0.5).setDepth(100).setWordWrapWidth(gameWidth, true).setFontSize(144)
        this.add.text(gameWidth / 2, 300, `Your Score is ${this.registry.get('registryScore')}`, textConfig).setOrigin(0.5).setDepth(100).setWordWrapWidth(gameWidth, true)

        this.add.image(gameWidth / 2, gameHeight / 2 - 125, 'md-angry').setInteractive()
        this.add.text(gameWidth / 2, gameHeight / 2 + 125, `${quotes[quotesIndex]}`, textConfig).setOrigin(0.5).setDepth(100).setWordWrapWidth(gameWidth - 150, true)


        const textRestart = this.add.text(gameWidth / 2, gameHeight - 400, `Restart`, textConfig).setOrigin(0.5)
        const imgRestart = this.add.image(gameWidth / 2, textRestart.y + 100, 'restart').setOrigin(0.5, 0.5).setScale(0.5)



        textRestart.setInteractive(new Phaser.Geom.Rectangle(0, 0, textRestart.width, textRestart.height + imgRestart.height), Phaser.Geom.Rectangle.Contains)

        const tweenReTxt = this.tweens.add({
            targets: textRestart,
            scaleX: 1.2,
            scaleY: 1.2,
            repeat: -1,
            duration: 800,
            yoyo: true

        });
        const tweenImgRe = this.tweens.add({
            targets: imgRestart,
            scaleX: 0.60,
            scaleY: 0.60,
            repeat: -1,
            duration: 800,
            yoyo: true,
        });
        const tweenImgRotate = this.tweens.add({
            targets: imgRestart,
            angle: 360,
            repeat: -1,
            duration: 4000,
        });

        textRestart
            .on('pointerdown', () => {
                // this.registry.set('registryScore', 0)
                // this.registry.set('registryRound', 0)
                this.sound.add('start').play()
                this.scene.stop('GameOver')
                this.scene.start('Game')

            })
            .on('pointerover', () => {
                tweenImgRotate.setTimeScale(2)
                tweenReTxt.setTimeScale(2)
                tweenImgRe.setTimeScale(2)
            })
            .on('pointerout', () => {
                tweenImgRotate.setTimeScale(1)
                tweenReTxt.setTimeScale(1)
                tweenImgRe.setTimeScale(1)
            })

        // EventBus.emit('current-scene-ready', this);
    }

    changeScene() {
        this.scene.start('MainMenu');
    }
}
