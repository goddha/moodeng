import { Scene } from 'phaser';
// import { quotes } from '../data/quotes';
// import { randomMinMax } from '../data/randomMinMax';
// import { assetName } from '../data/assetName';
// import { EventBus } from '../EventBus';

export class MainMenu extends Scene {
    // background: GameObjects.Image;
    // logo: GameObjects.Image
    // title: GameObjects.Text;
    // logoTween: Phaser.Tweens.Tween | null;

    // spriteMudeng: GameObjects.Image;

    constructor() {
        super('MainMenu');
    }

    create() {

        const gameWidth = this.sys.canvas.width
        const gameHeight = this.sys.canvas.height
        const spriteMudeng = this.add.image(gameWidth / 2, gameHeight / 2, 'md-front').setInteractive()

        this.add.text(gameWidth / 2, gameHeight / 2 - 350, `Cleaning Moodeng`, {
            fontFamily: 'Arial Black', fontSize: 64, color: '#ffffff',
            stroke: '#000000', strokeThickness: 10,
            align: 'center'
        }).setOrigin(0.5).setDepth(-1).setWordWrapWidth(gameWidth, true).setFontSize(144)

        this.add.image(0, 0, 'md-front').setOrigin(0, 0)
        this.add.image(gameWidth, 0, 'md-front').setOrigin(1, 0)
        this.add.image(0, gameHeight, 'md-front').setOrigin(0, 1)
        this.add.image(gameWidth, gameHeight, 'md-front').setOrigin(1, 1)

        const mark = this.add.image(spriteMudeng.x - 300, spriteMudeng.y - 175, 'mark').setDepth(-1).setScale(2).setVisible(false)
        this.tweens.add({
            targets: mark,
            easeParams: '',
            scaleX: 1.5,
            scaleY: 1.5,
            repeat: -1,
            duration: 500,
            yoyo: true

        });


        // const txtClickme = this.add.text(this.sys.canvas.width / 2, this.sys.canvas.height / 2 + 250, 'หมูเด้ง').setVisible(false).setFontSize(70).setOrigin(0.5, 0.5)

        spriteMudeng
            .on('pointerdown', () => {
                this.sound.add('start').play()
                this.scene.start('Game');
            })
            .on('pointerover', () => {
                spriteMudeng.setScale(1.5).setTexture('md-angry')
                // txtClickme.setVisible(true)
                mark.setVisible(true)
            })
            .on('pointerout', () => {
                spriteMudeng.setScale(1.0).setTexture('md-front')
                // txtClickme.setVisible(false)
                mark.setVisible(false)
            })

        // EventBus.emit('current-scene-ready', this);
    }

    update() {

    }





    // changeScene() {
    //     if (this.logoTween) {
    //         this.logoTween.stop();
    //         this.logoTween = null;
    //     }

    //     this.scene.start('Game');
    // }

    // moveLogo(vueCallback: ({ x, y }: { x: number, y: number }) => void) {
    //     if (this.logoTween) {
    //         if (this.logoTween.isPlaying()) {
    //             this.logoTween.pause();
    //         }
    //         else {
    //             this.logoTween.play();
    //         }
    //     }
    //     else {
    //         this.logoTween = this.tweens.add({
    //             targets: this.logo,
    //             x: { value: 750, duration: 3000, ease: 'Back.easeInOut' },
    //             y: { value: 80, duration: 1500, ease: 'Sine.easeOut' },
    //             yoyo: true,
    //             repeat: -1,
    //             onUpdate: () => {
    //                 if (vueCallback) {
    //                     vueCallback({
    //                         x: Math.floor(this.logo.x),
    //                         y: Math.floor(this.logo.y)
    //                     });
    //                 }
    //             }
    //         });
    //     }
    // }
}
