//IF the user  have a token, send it to dashboard

export default function ({ store, redirect }) {
    store.dispatch("readToken");

    if (store.state.auth) {
        return redirect('/dashboard');
    }
}