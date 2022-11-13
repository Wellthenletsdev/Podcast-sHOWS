import { html, css, LitElement } from 'https://cdn.jsdelivr.net/gh/lit/dist@2/all/lit-all.min.js'
import { store, connect } from '../store.js'

class Component extends LitElement {
    static get properties() {
        return {
            single: { state: true },
        }
    }

    constructor() {
        super()

        this.disconnectStore = connect((state) => {
            if (this.single === state.single) return
            this.single = state.single
        })
    }

    disconnectedCallback() { this.disconnectStore() }

    static styles = css`
        h1 {
            color: purple;
        }

        img {
            width: 100px;
            height: 100px;
        }
    `;

    render() {
        /**
         * @type {import('../types').show}
         */
        const show = this.single
        if (!show) {
            return html`<div></div>`
        }

        const backHandler = () => store.loadList()

        const seasons = show.seasons.map(({ episodes, title }) => {

            const image = show.image;

            return html`
                <div>
                    <strong>${title}</strong>
                    ${episodes.map((episode) => {
                        
                        const watchLaterHandler = () => {

                            let watchLaterList = JSON.parse(localStorage.getItem("watch-later")) ?? [];
                            console.log('watchlater', watchLaterList, watchLaterList[0]);
                            watchLaterList.push({...episode, image});
                            localStorage.setItem("watch-later", JSON.stringify(watchLaterList));
                            console.log(localStorage.getItem("watch-later"));
                        }
                        
                        return html`
                            <div>
                                <div>${episode.title}</div>
                                <button @click="${watchLaterHandler}"> Watch later </button>
                                <audio controls>
                                    <source src="episode.file" type="audio/mp3">
                                </audio>
                            </div>
                        `
                    })}
                </div>
            `
        })

        return html`
            <button @click="${backHandler}">👈 BACK</button>
            <h1>${show.title || ''}</h1>
            <img src="${show.image}">
            ${seasons}
        `
    }
}

customElements.define('podcast-view-single', Component)