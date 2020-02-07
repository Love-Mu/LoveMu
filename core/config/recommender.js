module.exports = {
  recommend: (err, users) => {
    const currUsrMap = req.user.genres;
    const usrGenreArr = [];
    currUsrMap.forEach((val, key, map) => {
      usrGenreArr.push(key);
    });
    users.forEach((usr) => {
      const tempScore = [];
      const tempUsrScore = [];
      const checkGenreArr = [];
      const checkUsrMap = usr.genres;
      checkUsrMap.forEach((val, key, map) => {
        checkGenreArr.push(key);
      });
      checkGenreArr.concat(usrGenreArr);
      usrGenreArr.forEach((val, idx) => {
        if (!checkGenreArr.includes(val)) {
          usrGenreArr.push(val);
        }
      });
      checkGenreArr.forEach((item, idx) => {
        if (currUsrMap.has(item)) {
          tempScore.push(currUsrMap.get(item));
        } else {
          tempScore.push(0);
        }
        if (checkUsrMap.has(item)) {
          tempUsrScore.push(checkUsrMap.get(item));
        } else {
          tempUsrScore.push(0);
        }
      });
      usr.score = similarity(tempScore, tempUsrScore);
      console.log(usr.email + ' : ' + usr.score);
    });
    return users.sort((a, b) => (a.score >= b.score) ? -1 : 1);
  }
}