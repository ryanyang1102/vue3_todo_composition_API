import { createApp, ref, onMounted, computed } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.1/vue.esm-browser.min.js';

const app = createApp({
  setup() {
    // 建立 todo 資料
    const todo = ref([
      // {
      //   id: '323',
      //   title: '322',
      //   completed: false,
      // }
    ]);
    // todo 輸入欄位的暫存字串
    const newTodo = ref('');

    // 資料掛載時就從 localStorage 取得資料
    onMounted (() => {
      todo.value = JSON.parse(localStorage.getItem('todo')) || [];
    });

    // 新增 todo
    const addTodo = () => {
      const value = newTodo.value.trim();
      const timestamp = Math.floor(Date.now());
      if(!value){
        return;
      };
      todo.value.push({
        id: timestamp,
        title: value,
        completed: false,
      });
      newTodo.value = '';
      localStorage.setItem('todo', JSON.stringify(todo.value));
    };

    // 移除 todo
    const removeTodo = item => {
      const newIndex = todo.value.findIndex(ele => ele.id === item.id);
      todo.value.splice(newIndex, 1);
      localStorage.setItem('todo', JSON.stringify(todo.value));
    };

    // 建立頁籤判斷字串
    const visibility = ref('all');
    // 建立頁籤功能
    const filteredTodo = computed(() => {
      switch(visibility.value) {
        case 'all':
          return todo.value;
          break;
        case 'notOk':
          return todo.value.filter(item => !item.completed);
          break;
        case 'isOk':
          return todo.value.filter(item => item.completed);
          break;
      }
    });

    // 建立編輯 todo 的暫存物件
    const cacheTodo = ref({});
    // 編輯 todo
    const editTodo = item => {
      cacheTodo.value = item;
    };
    // 取消編輯 todo
    const cancelEdit = () => {
      cacheTodo.value = {};
    };
    // 完成編輯 todo
    const doneEdit = item => {
      item.title = cacheTodo.value.title;
      cacheTodo.value = {};
      localStorage.setItem('todo', JSON.stringify(todo.value));
    };

    // 計算未完成數量
    const undone = computed(() => {
      let num = 0;
      todo.value.forEach( item => {
        if(!item.completed) {
          num++
        };
      });
      return num;
    });

    // 一件刪除 todo
    const removeAll = () => {
      if(confirm('Are you sure to delete all tasks ?')){
        todo.value = [];
        localStorage.setItem('todo', JSON.stringify(todo.value));
      } else {
        return;
      };
    };

    return {
      todo,
      newTodo,
      visibility,
      cacheTodo,
      addTodo,
      removeTodo,
      editTodo,
      cancelEdit,
      doneEdit,
      removeAll,
      filteredTodo,
      undone,
    };
  }
});
app.mount('#app');
