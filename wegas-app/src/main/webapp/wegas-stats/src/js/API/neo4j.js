import Axios from 'axios';

const BASE = '/rest/Statistics/';

export function getLogIds() {
    return Axios.get(BASE + 'LogId').then((res) => res.data);
}

export function getGameForLogId(logId) {
    return Axios.get(BASE + 'queryGames/' + logId).then(res => res.data);
}

export function getQuestionData(logID, name, ...games) {
    if (logID && name && games[0]) {
        return Axios.get(`${BASE}LogId/${logID}/Question/${name}`, {
            params: {
                gid: games.join(','),
            },
        }).then(res => res.data);
    }
    return Promise.reject('getQuestion: Missing parameters');
}
