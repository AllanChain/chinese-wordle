<script setup lang="ts">
import { ref } from 'vue'
import AbsoluteModal from './AbsoluteModal.vue'

const show = ref(true)

</script>

<template>
  <AbsoluteModal v-model="show">
    <div class="px-4 max-h-md overflow-x-auto">
      <h1 class="text-xl font-bold text-center mb-2">
        关于
      </h1>
      <p class="mb-2">
        <b>太长不看：</b>
        这是一个根据声母和韵母猜成语的小游戏。
        必须输入一个合法的成语。
        尽量在浏览器打开，而非微信。
      </p>
      <h2 class="font-bold text-center my-2 text-green-800">
        颜色提示
      </h2>
      <p class="mb-2">
        如果你猜的成语中某一个声母或韵母：
        <ul class="list-circle list-inside my-1">
          <li>位置与待猜成语相同，它就会被标成<span class="text-green-500">绿色</span></li>
          <li>出现在待猜成语中但位置错误，就是<span class="text-yellow-500">黄色</span></li>
          <li>韵母组合正确，会加上<span class="underline-green-500 underline-double underline">绿色双下划线</span></li>
          <li>压根没出现在待猜成语中，就是<span class="text-gray-500">灰色</span></li>
        </ul>
      </p>
      <h2 class="font-bold text-center my-2 text-fuchsia-800">
        其他提示
      </h2>
      <p class="mb-2">
        事实证明如果只有颜色的提示，猜成语会比较困难。所以游戏中还有其他提示，比如：
        <ul class="list-circle list-inside my-1">
          <li>
            待猜成语的某个字的声母和韵母：
            <ul class="indent-md list-square list-inside my-1">
              <li>都被猜到过，则提示该声母韵母组合</li>
              <li>组合被猜到，则提示该字的音调</li>
            </ul>
          </li>
          <li>所猜的成语的某个字的与待猜成语相同位置的字发音相同，则提示这个字</li>
        </ul>
      </p>
      <h2 class="font-bold text-center my-2 text-indigo-800">
        拼音
      </h2>
      <p class="mb-2">
        游戏中的拼音声母韵母划分基本按照
        <a
          href="http://www.moe.gov.cn/jyb_sjzl/ziliao/A19/195802/t19580201_186000.html"
          class="text-blue-700 hover:underline"
        >
          《汉语拼音方案》
        </a>
        来进行，
        有关韵母写法的问题，可翻阅新华字典附录《汉语拼音方案》韵母表后第 4 和第 5 条。
      </p>
      <p class="mb-2">
        主要不同之处在于，这里认为
        <b class="font-mono">
          <span class="text-yellow-500">zh</span>
          <span class="text-green-500">i</span>
        </b>
        等里和
        <b class="font-mono">
          <span class="text-yellow-500">j</span>
          <span class="text-green-500">i</span>
        </b>
        等里的
        <b class="font-mono text-green-500">i</b>
        是一样的。
      </p>
      <p>
        感谢
        <a
          href="https://github.com/Yixuan-Wang"
          class="text-yellow-600 hover:underline"
        >
          @Yixuan-Wang
        </a>
        对拼音算法的校对修正工作。
      </p>
      <h2 class="font-bold text-center my-2 text-pink-800">
        成语与参考资料
      </h2>
      <p class="mb-2">
        游戏中用作待猜成语的主要来自
        <a
          href="http://thuocl.thunlp.org/#chengyu"
          class="text-purple-700 hover:underline"
        >
          THUOCL 的成语词频表</a>，
        并经过人工简单筛选，去掉了一部分不适合猜的成语。
        作为验证输入的成语比用作待猜成语的数量更多，其选取和注音主要来自<a
          href="https://www.zdic.net/cd/cybs/"
          class="text-red-900 hover:underline"
        >汉典</a>，并利用
        <a
          href="https://github.com/mozillazg/python-pinyin"
          class="text-sky-700 hover:underline"
        >
          pypinyin
        </a>
        库作了简单的自动校对。
        部分未能自动校对的一百来个成语被未被纳入列表。
      </p>
      <h2 class="font-bold text-center my-2 text-violet-800">
        分享
      </h2>
      <p class="mb-2">
        可以直接截屏分享来晒本局成绩，也可在右上角的统计按钮中查看一些统计信息。
      </p>
      <p class="mb-2">
        游戏结束后，点击复制链接按钮，邀请好友打开，即可让好友也来猜猜这个成语。
      </p>
      <h2 class="font-bold text-center my-2 text-lime-800">
        项目
      </h2>
      <p class="mb-2">
        本项目<a
          href="https://github.com/AllanChain/chinese-wordle"
          class="text-blue-700 hover:underline"
        >在 GitHub 开源</a>，如有问题和建议欢迎提出。
      </p>
      <p class="mb-2">
        项目的灵感来自于 wordle，很容易搜到，不多叙述。
      </p>
      <br>
      <p>在下方的输入框中输入任意一个四字成语开始游戏。</p>
    </div>
  </AbsoluteModal>
</template>
