B1;4205;0cvar getBase2, getResultBase2;

getBase2 = function() {
    var base, i, result;
    result = [];
    base = 32;
    i = 0;
    while (i < 32) {
      result.push(Math.pow(2, i));
      i++;
  }
    return result;
};

getResultBase2 = getBase2();

module.exports = {
    compareListOr: function (listA, listB) {
	var range  = Math.max.apply(Math, [listA.length, listB.length]);
	var lstOpt = [];
	for (i = 0; i < range;  i++) {
	    if (i<Math.min.apply(Math, [listA.length, listB.length])){
		lstOpt.push(listA[i] | listB[i]);
	    } else {
		if (i>=listA.length){
		    lstOpt.push(listB[i]);
		}else {
		    lstOpt.push(listA[i]);
		}
	    }
	}
	return lstOpt;
    },

   compare: function (listA, listB) {
	var array, i, range;
	range = Math.min.apply(Math, [listA.length, listB.length]);
	array = [];
	i = 0;
	while (i < range) {
	    array.push(listA[i] & listB[i]);
	    i++;
	}
	return array;
    },

    fuse: function(listA, listB) {
	var getArray, i, range;
	range = Math.max.apply(Math, [listA.length, listB.length]);
	getArray = [];
	i = -1;
	while (i < range) {
	    i++;
	    if (i < Math.min.apply(Math, [listA.length, listB.length])) {
		getArray.push(listA[i] + listB[i]);
	    } else {
		if (i >= listA.length) {
		    getArray.push(listB[i]);
		} else {
		    getArray.push(listA[i]);
		}
	    }
	}
	return getArray;
    },

    decode: function(map_embed) {
	var base, i, list, n, q, r;
	i = 0;
	list = [];
	while (i < map_embed.length) {
	    if (map_embed[i] !== 0) {
		base = 31;
		n = map_embed[i];
		r = n;
		while (r !== 0) {
		    r = n % getResultBase2[base];
		    q = (n - r) / getResultBase2[base];
		    if (q === 1) {
			list.push(base + (32 * i));
		    }
		    n = r;
		    base--;
		}
	    }
	    i++;
	}
	return list;
    }
}
