<script setup>
import { ref } from 'vue';

const comment = ref('');
const comments = ref([]);

const submitComment = () => {
  if (comment.value.trim()) {
    comments.value.push(comment.value);
    comment.value = '';
  }
};
</script>

<template>
  <div>
    <h3>Comments</h3>
    <input v-model="comment" placeholder="Leave a comment" />
    <button @click="submitComment">Submit</button>
    <div>
      <p v-for="(cmt, index) in comments" :key="index">{{ cmt }}</p>
    </div>
  </div>
</template>
