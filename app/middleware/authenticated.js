//IF the user does not have a token, send it to login

export default function ({ store, redirect }) {
    store.dispatch("readToken");

    if (!store.state.auth) {
        return redirect('/login');
    }
}