function deepCopy(obj, cache=[]) {
    // 如果是null或者不是object直接返回
    if (obj === null || typeof obj !== 'object') {
        return obj;
    }
    // 判断是否是时间或正则对象
    if(obj.constructor === Date) return new Date(obj);
    if(obj.constructor === RegExp) return new RegExp(obj);
    // 如果传入的对象与缓存的相等, 则递归结束, 这样防止循环
    /**
     * 类似下面这种
     * var a = {b:1}
     * a.c = a
     * 资料: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Errors/Cyclic_object_value
     */
    const hit = cache.filter(c => c.orignal === obj)[0];
    if (hit) {
        return hit.copy;
    }
    const copy = Array.isArray(obj) ? [] : {};
    // 将copy首先放入cache, 因为我们需要在递归deepCopy的时候引用它
    cache.push({
        orignal: obj,
        copy
    });
    Object.keys(obj).forEach(key => {
        copy[key] = deepCopy(obj[key], cache);
    })
    return copy;
}
