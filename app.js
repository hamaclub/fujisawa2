// app.js: アプリのメインロジック

document.addEventListener('DOMContentLoaded', () => {
    // === 画面切り替えのロジック ===
    const navButtons = document.querySelectorAll('.nav-button, .menu-item');
    const screens = document.querySelectorAll('.screen');

    navButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const targetScreenId = e.currentTarget.getAttribute('data-screen');
            if (!targetScreenId) return;

            // 画面を切り替え
            screens.forEach(screen => {
                screen.classList.add('hidden');
                screen.classList.remove('active');
            });
            const targetScreen = document.getElementById(targetScreenId);
            if (targetScreen) {
                targetScreen.classList.remove('hidden');
                targetScreen.classList.add('active');
            }

            // ナビバーのactive状態を更新
            document.querySelectorAll('.nav-button').forEach(navBtn => {
                navBtn.classList.remove('active');
            });
            // data-screenが一致するナビボタンがあればactiveにする
            document.querySelector(`.nav-button[data-screen="${targetScreenId}"]`)?.classList.add('active');
        });
    });

    // === クイズデータ ===
    const quizData = [
        {
            question: "藤沢市に津波警報が出た時、海岸近くにいたら、まず最初にする行動はどれキュン？",
            options: ["荷物をまとめて家に帰る", "写真を撮ってSNSに投稿する", "すぐに高台や津波避難ビルに避難する", "海から離れた場所で様子を見る"],
            answerIndex: 2,
            fujikyun_tip: "津波はあっという間に来るから、すぐに逃げるのが一番大事だキュン！"
        },
        {
            question: "地震が起きて、揺れが収まった後、ブレーカーを落とすのは何のためキュン？",
            options: ["節電のため", "火事を防ぐため", "すぐに電気を再開させるため", "家族に連絡するため"],
            answerIndex: 1,
            fujikyun_tip: "通電火災を防ぐための大切な行動だキュン！避難する時は忘れずにね！"
        },
        // さらに問題を追加...
    ];

    let currentQuizIndex = 0;
    let score = parseInt(localStorage.getItem('quiz_score')) || 0;
    
    const questionTextElement = document.getElementById('question-text');
    const optionsContainer = document.getElementById('options-container');
    const scoreDisplay = document.getElementById('current-score');
    const nextButton = document.getElementById('next-button');
    const fujikyunMessage = document.getElementById('fujikyun-message');

    // スコア表示を更新
    scoreDisplay.textContent = score;

    // クイズの表示
    function loadQuiz() {
        if (currentQuizIndex >= quizData.length) {
            questionTextElement.textContent = "おめでとう！今日のクイズは全部クリアだキュン！";
            optionsContainer.innerHTML = `<p>また明日新しい問題にチャレンジしてね！</p>`;
            nextButton.classList.add('hidden');
            return;
        }

        const currentQuiz = quizData[currentQuizIndex];
        questionTextElement.textContent = currentQuiz.question;
        optionsContainer.innerHTML = '';
        nextButton.classList.add('hidden');

        currentQuiz.options.forEach((option, index) => {
            const button = document.createElement('button');
            button.classList.add('option-button');
            button.textContent = option;
            button.setAttribute('data-index', index);
            button.addEventListener('click', handleAnswer);
            optionsContainer.appendChild(button);
        });
    }

    // 回答処理
    function handleAnswer(e) {
        const selectedButton = e.target;
        const selectedIndex = parseInt(selectedButton.getAttribute('data-index'));
        const correctIndex = quizData[currentQuizIndex].answerIndex;
        const fujikyunTip = quizData[currentQuizIndex].fujikyun_tip;

        // 全てのボタンのクリックイベントを一時的に解除
        document.querySelectorAll('.option-button').forEach(btn => {
            btn.removeEventListener('click', handleAnswer);
        });

        if (selectedIndex === correctIndex) {
            selectedButton.classList.add('correct');
            score += 10; // 正解で10点加算
            fujikyunMessage.textContent = `正解だキュン！やったね！✨ ${fujikyunTip}`;
        } else {
            selectedButton.classList.add('incorrect');
            // 正解のボタンも表示
            document.querySelector(`.option-button[data-index="${correctIndex}"]`).classList.add('correct');
            fujikyunMessage.textContent = `残念、まちがえちゃったキュン...😢 でも大丈夫！ ${fujikyunTip}`;
        }

        scoreDisplay.textContent = score;
        localStorage.setItem('quiz_score', score); // スコアを保存
        nextButton.classList.remove('hidden');
    }

    // 次へボタンの処理
    nextButton.addEventListener('click', () => {
        currentQuizIndex++;
        loadQuiz();
        // ふじキュンのメッセージをリセット（ホーム画面用のメッセージに戻しても良い）
        fujikyunMessage.textContent = "次の問題にチャレンジだキュン！";
    });

    // 初期ロード
    loadQuiz();
    
    // ホーム画面のふじキュンメッセージを起動時に一度更新
    fujikyunMessage.textContent = "キュンとするまち、藤沢の防災を一緒に学ぼうキュン！";
});
