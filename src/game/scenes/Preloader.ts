import { Scene } from 'phaser';
import { assetName } from '../data/assetName'

export class Preloader extends Scene {
    constructor() {
        super('Preloader');
    }

    init() {

        const loadingQuotes = [
            'waking up Moodeng...',
            'Moodeng is ready'
        ]

        const txtLoading = this.add.text(this.sys.canvas.width / 2, this.sys.canvas.height / 2 + 50, loadingQuotes[0], {
            fontFamily: 'Arial Black', fontSize: 32, color: '#ffffff',
            stroke: '#000000', strokeThickness: 3,
            align: 'center'
        }).setOrigin(0.5)

        //  We loaded this image in our Boot Scene, so we can display it here
        // this.add.image(512, 384, 'background');

        //  A simple progress bar. This is the outline of the bar.
        this.add.rectangle(this.sys.canvas.width / 2, this.sys.canvas.height / 2, 932, 32).setStrokeStyle(1, 0xffffff);

        //  This is the progress bar itself. It will increase in size from the left based on the % of progress.
        const bar = this.add.rectangle(this.sys.canvas.width / 2 - 462, this.sys.canvas.height / 2, 4, 28, 0xffffff);

        //  Use the 'progress' event emitted by the LoaderPlugin to update the loading bar
        this.load.on('progress', (progress: number) => {

            //  Update the progress bar (our bar is 464px wide, so 100% = 464px)
            bar.width = 4 + (928 * progress);

            if (progress > 0.9) {
                txtLoading.setText(loadingQuotes[1])
            }



        });
    }

    preload() {
        //  Load the assets for the game - Replace with your own assets
        this.load.setPath('assets/moodeng');

        assetName.single.map((name) => {
            this.load.image(name, `${name}.png`);
            // console.log({ name });
        }


        );

        assetName.atlas.map((name) => {
            this.load.atlas(`atlas-${name}`, `${name}.png`, `${name}.json`);
        }
        )
        assetName.audio.map((name) => {
            this.load.audio(`${name}`, `${name}.mp3`);
        }
        )


    }

    create() {
        //  When all the assets have loaded, it's often worth creating global objects here that the rest of the game can use.
        //  For example, you can define global animations here, so we can use them in other scenes.

        //  Move to the MainMenu. You could also swap this for a Scene Transition, such as a camera fade.
        this.registry.set('registryRound', 1)
        this.registry.set('registryScore', 0)
        this.scene.start('MainMenu');
    }
}
