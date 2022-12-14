import { html, css, LitElement } from 'https://cdn.jsdelivr.net/gh/lit/dist@2/all/lit-all.min.js'
import { store, connect } from '../store.js'

const MONTHS = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec'
]



class Component extends LitElement {
    static get properties() {
        return {
            previews: { state: true },
            sorting: { state: true },
            search: { state: true },
            image: {state:true}
        }
    }

    constructor() {
        console.log('hello');
        super()

        this.disconnectStore = connect((state) => {
            if (this.previews !== state.previews) { this.previews = state.previews }
            if (this.sorting !== state.sorting) { this.sorting = state.sorting }
            if (this.search !== state.search) { this.search = state.search } 
        })
    }

    disconnectedCallback() { this.disconnectStore() }

    static styles = css`
        li {
            border: 1px solid var(--primary-blue);
            
        }
    `;

    render() {
        /**
         * @type {import('../types').preview[]}
         */
        const previews = this.previews


        const filteredPreviews = previews.filter(item => {
            if (!this.search) return true
            return item.title.toLowerCase().includes(this.search.toLowerCase())
        })

        const sortedPreviews = filteredPreviews.sort((a, b) => {
            if (this.sorting === 'a-z') return a.title.localeCompare(b.title)
            if (this.sorting === 'z-a') return b.title.localeCompare(a.title)

            const dateA = new Date(a.updated).getTime()
            const dateB = new Date(b.updated).getTime()

            if (this.sorting === 'oldest-latest') return dateA - dateB
            if (this.sorting === 'latest-oldest') return dateB - dateA

            throw new Error('Invalid sorting')
         })

        const backHandler = () => store.loadList()

        const list = sortedPreviews.map(({ title, file, image }) => {
            // const date = new Date(updated)
            // const day = date.getDate()
            // const month = MONTHS[date.getMonth() - 1]
            // const year = date.getFullYear()

            const clickHandler = () => store.loadSingle(id)

            return html`
                <li class="podcast-list-items">
                    <div style="margin=1vw;">
                        <img id="img" src="${image}" height="100" width="100"/>
                    </div>
                    <div>
                        <div>${title}</div>
                        <audio controls>
                            <source src="${file}" type="audio/mp3">
                        </audio>
                    </div>
                </li>

            `
        
    
        })

        return html`
            <button @click="${backHandler}">???? BACK</button>
            <h1>Watch Later List</h1>
            <podcast-controls></podcast-controls>
            ${list.length > 0 ? html`<ul>${list}</ul>` : html`<div>No matches</div>`}
        `

        
    }
}


customElements.define('podcast-view-watch-later', Component)