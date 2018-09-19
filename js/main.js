;(function () {
    'use strict';
    new Vue({
        el: '#app',
        data: {
            list: [],
            current: {},
            more_desc: false,
        },
        mounted: function() {
          this.list = ms.get('list') || this.list;
          this.last_id = ms.get('last_id') || this.last_id;
          var me = this;

          setInterval(function() {
              me.check_alerts();
          }, 1000);
        },
        methods: {
            check_alerts: function() {
              this.list.forEach(function(row){
                  var alert_at = row.alert_at;
                  if(!alert_at) return;
                  var alert_at = (new Date(alert_at).getTime());
                  var now_time = (new Date()).getTime();
                  if (alert_at == now_time){
                      confirm(row.title);
                  }
              })
            },
            merge: function(){
                var is_update, id;
                is_update = id = this.current.id;
                if(is_update){
                    var index = this.find_index(id);
                    Vue.set(this.list, index, Object.assign({}, this.current));
                }else{
                    var title = this.current.title;
                    if (!title && title!==0) return;
                    var todo = Object.assign({}, this.current);
                    todo.id = this.next_id();
                    this.list.push(todo);
                }
                this.reset_input();
            },
            find_index: function(id) {
                return this.list.findIndex(function(item){
                    return item.id == id;
                })
            },
            next_id: function() {
                return this.list.length + 1;
            },
            remove: function(id) {
                return this.list.splice(id, 1);
            },
            set_current: function(todo) {
                this.current = Object.assign({}, todo);
            },
            reset_input: function (){
                this.set_current({});
            },
            toggle_complete: function(id) {
              var i = this.find_index(id);
              Vue.set(this.list[i], 'completed', !this.list[i].completed);
            },
            toggle_detail: function(id){
              var i = this.find_index(id);
              Vue.set(this.list[i], 'show_detail', !this.list[i].show_detail)
            },
            watch: {
                list: {
                    deep: true,
                    handler: function(new_val, old_val) {
                        if(new_val) {
                            ms.set('list',new_val);
                        }else {
                            ms.set('list', []);
                        }
                    }
                }
            }
        }
    });
})();