var TheBookRater = function () {
    LocalContractStorage.defineMapProperty(this, "indexMap");
    LocalContractStorage.defineMapProperty(this, "dataMap");
    LocalContractStorage.defineProperty(this, "size");
};

TheBookRater.prototype = {
    init: function () {
        this.size = 0;
    },
    rate: function (title, author, comment, score) {
        var index = this.size;
        var rater = Blockchain.transaction.from;
        var key = title + "-" + author + "-" + rater;
        if (this.dataMap.get(key)) return -1;
        this.indexMap.set(index, key);
        var value = {};
        value.key = key;
        value.title = title;
        value.author = author;
        value.rater = rater;
        value.comment = comment;
        value.score = score;
        this.dataMap.set(key, value);
        this.size += 1;
        return this.size;
    },
    len: function () {
        return this.size;
    },
    query: function (title, author) {
        result = [];
        for (var i = 0; i < this.size; i++) {
            var key = this.indexMap.get(i);
            if (key.startsWith(title + "-" + author)) {
                var object = this.dataMap.get(key);
                result.push(object);
            }
        }
        return result;
    },
    fetchAll: function () {
        result = [];
        for (var i = 0; i < this.size; i++) {
            var key = this.indexMap.get(i);
            var object = this.dataMap.get(key);
            result.push(object);
        }
        return result;
    }
};

module.exports = TheBookRater;