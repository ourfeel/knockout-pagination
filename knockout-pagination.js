;(function (window, ko) {
    "use strict";
     var _ = ko.utils, options = {
        itemsPerPage: 10,
        currentPage: 0,
        prevText: '上一页',
        nextText: '下一页',
        isShowTotal: false,
        numDisplayEntries:11
    };
    var ViewModel = function(params, componentInfo){
        this.pageItems = ko.observableArray([]);
        this.options = _.extend({},options,params.options);
        this.totalCount = params.totalCount;
        this.options.pageIndex.subscribe(function(nv){
            var interval = this.getInterval(nv),
                items = [];
            while (interval.start<=interval.end){
                items.push(interval.start);
                ++interval.start;
            }
            this.pageItems(items);
        },this)
    }
    _.extend(viewModel.prototype,{
        isCurrent:function($data){
            return $data == ko.unwrap(this.options.pageIndex);
        },
        change:function($data){
            if (this.isCurrent($data)) return;
            this.options.pageIndex($data);
            this.options.callback($data);
        },
        numPages:function(){
            var maxentries = ko.unwrap(this.totalCount),
                pageSize= ko.unwrap(this.options.pageSize);
            return Math.ceil((!maxentries?1:maxentries)/pageSize);
        },
        getInterval:function(currentPage){
            var numDisplayEntries = ko.unwrap(this.options.numDisplayEntries),
                nf = Math.floor(numDisplayEntries/2);
            var np = this.numPages(),
                upperLimit = np - numDisplayEntries;
            var start = currentPage > nf ? Math.max(Math.min(currentPage - nf, upperLimit), 0) : 0;
            var end = currentPage > nf ? Math.min(currentPage + nf + (numDisplayEntries % 2), np) : Math.min(numDisplayEntries, np);
            return { start: start, end: end };
        }
    });
})(window, ko);
