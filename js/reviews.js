// ==========================================
// Intellectual Arts - Firebase Reviews System
// ==========================================

const firebaseConfig = {
  apiKey: "AIzaSyAMzKZYyImmagSW7sO2ai7MY0IEk1PXzg8",
  authDomain: "review-cc544.firebaseapp.com",
  projectId: "review-cc544",
  storageBucket: "review-cc544.firebasestorage.app",
  messagingSenderId: "970664971745",
  appId: "1:970664971745:web:bffae8ed1d06c96e5a96a0",
  measurementId: "G-HWZXEBLXY2"
};

// Initialize Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const db = firebase.firestore();

document.addEventListener('DOMContentLoaded', () => {
    const reviewsList = document.getElementById('reviewsList');
    const reviewForm = document.getElementById('reviewForm');
    
    if (!reviewsList) return;

    const productId = reviewsList.getAttribute('data-product-id');

    // Fetch Reviews
    function fetchReviews() {
        db.collection("reviews")
          .where("productId", "==", productId)
          .orderBy("timestamp", "desc")
          .onSnapshot((querySnapshot) => {
              reviewsList.innerHTML = "";
              if (querySnapshot.empty) {
                  reviewsList.innerHTML = '<p style="color: var(--text-light);">No reviews yet. Be the first to review!</p>';
                  return;
              }
              querySnapshot.forEach((doc) => {
                  const data = doc.data();
                  addReviewToDOM(data);
              });
          });
    }

    function addReviewToDOM(data) {
        const date = data.timestamp ? new Date(data.timestamp.seconds * 1000).toLocaleDateString() : "Just now";
        const starsHtml = '<i class="fas fa-star"></i>'.repeat(data.rating) + '<i class="far fa-star"></i>'.repeat(5 - data.rating);
        
        const reviewEl = document.createElement('div');
        reviewEl.className = 'review-card animate-on-scroll visible';
        reviewEl.innerHTML = `
            <div class="stars">${starsHtml}</div>
            <div class="review-header">
                <span class="review-author">${data.name}</span>
                <span class="review-date">${date}</span>
            </div>
            <p class="review-text">${data.comment}</p>
        `;
        reviewsList.appendChild(reviewEl);
    }

    // Submit Review
    if (reviewForm) {
        reviewForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const ratingInput = document.getElementById('ratingInput');
            const rating = parseInt(ratingInput.getAttribute('data-rating'));
            const name = document.getElementById('reviewerName').value;
            const email = document.getElementById('reviewerEmail').value;
            const comment = document.getElementById('reviewText').value;

            if (rating === 0) {
                alert("Please select a star rating!");
                return;
            }

            db.collection("reviews").add({
                productId: productId,
                name: name,
                email: email,
                rating: rating,
                comment: comment,
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
            })
            .then(() => {
                alert("Thank you for your review!");
                reviewForm.reset();
                // Reset stars
                document.querySelectorAll('.rating-star').forEach(s => {
                    s.classList.remove('active');
                    s.classList.replace('fas', 'far');
                });
                ratingInput.setAttribute('data-rating', "0");
            })
            .catch((error) => {
                console.error("Error adding review: ", error);
                alert("Error submitting review. Please try again.");
            });
        });
    }

    fetchReviews();
});
