"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ProfileCard = (function () {
    function ProfileCard(webId, name, role, gender, country, locality, postalCode, job, address, organization, imageProfile, friends, posts, images) {
        this._friends = [];
        this._posts = [];
        this._images = [];
        this._webId = webId;
        this._name = name;
        this._role = role;
        this._gender = gender;
        this._country = country;
        this._locality = locality;
        this._postalCode = postalCode;
        this._job = job;
        this._address = address;
        this._organization = organization;
        this._imageProfile = imageProfile;
        this._friends = friends;
        this._posts = posts;
        this._images = images;
    }
    Object.defineProperty(ProfileCard.prototype, "webId", {
        get: function () {
            return this._webId;
        },
        set: function (value) {
            this._webId = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProfileCard.prototype, "name", {
        get: function () {
            return this._name;
        },
        set: function (value) {
            this._name = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProfileCard.prototype, "role", {
        get: function () {
            return this._role;
        },
        set: function (value) {
            this._role = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProfileCard.prototype, "gender", {
        get: function () {
            return this._gender;
        },
        set: function (value) {
            this._gender = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProfileCard.prototype, "country", {
        get: function () {
            return this._country;
        },
        set: function (value) {
            this._country = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProfileCard.prototype, "locality", {
        get: function () {
            return this._locality;
        },
        set: function (value) {
            this._locality = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProfileCard.prototype, "postalCode", {
        get: function () {
            return this._postalCode;
        },
        set: function (value) {
            this._postalCode = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProfileCard.prototype, "job", {
        get: function () {
            return this._job;
        },
        set: function (value) {
            this._job = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProfileCard.prototype, "address", {
        get: function () {
            return this._address;
        },
        set: function (value) {
            this._address = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProfileCard.prototype, "organization", {
        get: function () {
            return this._organization;
        },
        set: function (value) {
            this._organization = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProfileCard.prototype, "imageProfile", {
        get: function () {
            return this._imageProfile;
        },
        set: function (value) {
            this._imageProfile = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProfileCard.prototype, "friends", {
        get: function () {
            return this._friends;
        },
        set: function (value) {
            this._friends = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProfileCard.prototype, "posts", {
        get: function () {
            return this._posts;
        },
        set: function (value) {
            this._posts = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProfileCard.prototype, "images", {
        get: function () {
            return this._images;
        },
        set: function (value) {
            this._images = value;
        },
        enumerable: true,
        configurable: true
    });
    return ProfileCard;
}());
exports.default = ProfileCard;
