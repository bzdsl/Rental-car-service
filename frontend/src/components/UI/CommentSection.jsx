/** @format */

import React, { useState } from "react";
import { Row, Col } from "reactstrap";

const CommentSection = () => {
  const [comments, setComments] = useState([
    {
      name: "Nguyễn Văn A",
      rating: 5,
      text: "Trải nghiệm tuyệt vời! Xe sạch sẽ và trong tình trạng hoàn hảo.",
      reply:
        "Cảm ơn bạn đã phản hồi, Nguyễn Văn A! Chúng tôi rất vui vì bạn thích chiếc xe.",
    },
    {
      name: "Trần Thị B",
      rating: 4,
      text: "Dịch vụ tuyệt vời, nhưng GPS hơi lỗi thời một chút.",
      reply:
        "Cảm ơn bạn đã đánh giá, Trần Thị B! Chúng tôi đang cập nhật hệ thống GPS.",
    },
    {
      name: "Lê Thị C",
      rating: 5,
      text: "Yêu thích chiếc xe này! Lái mượt mà và tiết kiệm nhiên liệu rất tốt.",
      reply:
        "Cảm ơn bạn đã chia sẻ lời khen, Lê Thị C! Chúng tôi rất vui khi bạn hài lòng với trải nghiệm.",
    },
  ]);

  const [newComment, setNewComment] = useState({
    name: "",
    text: "",
    rating: 0,
  });

  const handleAddComment = (e) => {
    e.preventDefault();
    if (
      newComment.name.trim() &&
      newComment.text.trim() &&
      newComment.rating > 0
    ) {
      // Add new comment to the list
      setComments((prev) => [...prev, newComment]);
      // Reset the form
      setNewComment({ name: "", text: "", rating: 0 });
    }
  };

  const handleRatingChange = (rating) => {
    setNewComment((prev) => ({ ...prev, rating }));
  };

  return (
    <Row className="mt-5">
      <Col lg="12">
        <div className="comment__section mt-5">
          <h4>Bình luận</h4>
          {/* Display user comments and admin replies in a bigger box */}
          <ul className="list-unstyled mb-4">
            {comments.map((comment, index) => (
              <li key={index} className="mb-4">
                <div className="comment bg-light p-3 rounded">
                  {/* Display user comment */}
                  <div className="user-comment mb-3">
                    <h6 className="mb-1">{comment.name}</h6>
                    <div className="mb-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <i
                          key={star}
                          className={`ri-star-s-fill ${
                            star <= comment.rating
                              ? "text-warning"
                              : "text-muted"
                          }`}></i>
                      ))}
                    </div>
                    <p>{comment.text}</p>
                  </div>

                  {/* Display admin reply in a separate box within the same larger box */}
                  {comment.reply && (
                    <div className="admin-reply mt-3 p-3 bg-light border rounded">
                      <strong>Admin:</strong>
                      <p>{comment.reply}</p>
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>

          {/* Add new comment form */}
          <form onSubmit={handleAddComment}>
            <div className="mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Tên của bạn"
                value={newComment.name}
                onChange={(e) =>
                  setNewComment((prev) => ({
                    ...prev,
                    name: e.target.value,
                  }))
                }
                required
              />
            </div>
            <div className="mb-3">
              <textarea
                rows="4"
                className="form-control"
                placeholder="Viết bình luận..."
                value={newComment.text}
                onChange={(e) =>
                  setNewComment((prev) => ({
                    ...prev,
                    text: e.target.value,
                  }))
                }
                required></textarea>
            </div>
            <div className="mb-3">
              <span>Đánh giá: </span>
              {[1, 2, 3, 4, 5].map((star) => (
                <i
                  key={star}
                  className={`ri-star-s-fill ${
                    star <= newComment.rating ? "text-warning" : "text-muted"
                  }`}
                  style={{ cursor: "pointer" }}
                  onClick={() => handleRatingChange(star)}></i>
              ))}
            </div>
            <button type="submit" className="btn btn-primary">
              Thêm Bình Luận
            </button>
          </form>
        </div>
      </Col>
    </Row>
  );
};

export default CommentSection;
