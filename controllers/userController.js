const { Reaction, Thought, User } = require("../models");

const headCount = async () =>
  User.aggregate()
    .count("userCount")
    .then((numberOfUsers) => numberOfUsers);

const friend = async (userId) =>
  User.aggregate([
    {
      $unwind: "$friends",
    },
    {
      $group: { _id: userId },
    },
  ]);

module.exports = {
  getUsers(req, res) {
    User.find()
      .then(async (users) => {
        const userObj = {
          users,
          headCount: await headCount(),
        };
        return res.json(userObj);
      })
      .catch((err) => {
        console.log(err);
        return res.status(500).json(err);
      });
  },
  getSingleUser(req, res) {
    User.findOne({ _id: req.params.userId })
      .select("-_v")
      .then(async (user) =>
        !user
          ? res.status(404).json({ message: "No user with that ID" })
          : res.json({
              user,
              // friend: await friend(req.params.userId),
            })
      )
      .catch((err) => {
        console.log(err);
        return res.status(500).json(err);
      });
  },
  createUser(req, res) {
    User.create(req.body)
      .then((user) => res.json(user))
      .catch((err) => res.status(500).json(err));
  },
  updateUser(req, res) {
    User.findOneAndUpdate(
      { _id: req.params.userId },
      { $set: req.body },
      //   { runValidators: true },
      { new: true }
    )
      .then((user) =>
        !user
          ? res.status(400).json({ message: "No User with this ID!" })
          : res.json(user)
      )
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  },
  deleteUser(req, res) {
    User.findOneAndDelete({ _id: req.params.userId })
      //   .then((user) =>
      //     !user
      //       ? res.status(404).json({ message: "No User with this ID" })
      //       : Thought.findOneAndDelete(
      //           { users: req.params.userId },
      //           { $pull: { users: req.params.userId } },
      //           { new: true }
      //         )
      //   )
      .then((user) =>
        !user
          ? res.status(400).json({
              message: "User created but no though with this ID!",
            })
          : res.json({ message: "User successfully deleted!" })
      )
      .catch((err) => res.status(500).json(err));
  },
  addFriend(req, res) {
    console.log("You are adding a Friend");
    User.findOneAndUpdate(
      { _id: req.params.userId },
      { $addToSet: { friends: req.params.friendId } },
      //   { runValidators: true },
      { new: true }
    )
      .then((newFriend) =>
        !newFriend
          ? res.status(400).json({ message: "No Friend found with that ID" })
          : res.json(newFriend)
      )
      .catch((err) => res.status(500).json(err));
  },
  removeFriend(req, res) {
    User.findByIdAndUpdate(
      { _id: req.params.userId },
      { $pull: { friends: req.params.friendId } },
      //   { runValidators: true },
      { new: true }
    )
      .then((user) =>
        !user
          ? res.status(404).json({ message: "No user found with that ID" })
          : res.json(user)
      )
      .catch((err) => res.status(500).json(err));
  },
};
