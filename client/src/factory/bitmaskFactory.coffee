tableau
.factory 'bitmaskFactory', () ->
    compare : (listA, listB) ->
         range  = Math.min.apply(Math, [listA.length, listB.length])
         # bool = 0
         array = []
         i = 0
         while (i < range)
           array.push (listA[i] & listB[i])
           i++
         return array

    fuse : (listA, listB) ->
         range  = Math.max.apply(Math, [listA.length, listB.length])
         getArray = []
         i = -1
         while (i < range)
            i++
            if i < Math.min.apply(Math, [listA.length, listB.length])
              getArray.push (listA[i] + listB[i])
            else
              if i >= listA.length
                getArray.push (listB[i])
              else
                getArray.push (listA[i])
         return getArray

    decode : (map_embed) ->
        console.log "ça passe dans map embed"
        #  = getResultBase2[base]
        i = 0
        list = []
        while i < map_embed.length
            if map_embed[i] != 0
                base = 31
                # l = getResultBase2[base]
                # base2 = getResultBase2
                n    = map_embed[i]
                r    = n
                while r != 0
                    r = n%getResultBase2[base]
                    q = (n-r)/getResultBase2[base]
                    if q == 1
                        list.push base + (32*i)
                    n = r
                    base--
            i++
        return list
