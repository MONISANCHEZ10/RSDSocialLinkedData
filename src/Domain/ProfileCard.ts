
export default class ProfileCard {
    get webId(): string {
        return this._webId;
    }

    set webId(value: string) {
        this._webId = value;
    }

    get name(): string {
        return this._name;
    }

    set name(value: string) {
        this._name = value;
    }

    get role(): string {
        return this._role;
    }

    set role(value: string) {
        this._role = value;
    }

    get gender(): string {
        return this._gender;
    }

    set gender(value: string) {
        this._gender = value;
    }

    get country(): string {
        return this._country;
    }

    set country(value: string) {
        this._country = value;
    }

    get locality(): string {
        return this._locality;
    }

    set locality(value: string) {
        this._locality = value;
    }

    get postalCode(): string {
        return this._postalCode;
    }

    set postalCode(value: string) {
        this._postalCode = value;
    }

    get job(): string {
        return this._job;
    }

    set job(value: string) {
        this._job = value;
    }

    get address(): string {
        return this._address;
    }

    set address(value: string) {
        this._address = value;
    }

    get organization(): string {
        return this._organization;
    }

    set organization(value: string) {
        this._organization = value;
    }

    get imageProfile(): string {
        return this._imageProfile;
    }

    set imageProfile(value: string) {
        this._imageProfile = value;
    }

    get friends(): Array<string> {
        return this._friends;
    }

    set friends(value: Array<string>) {
        this._friends = value;
    }

    get posts(): Array<string> {
        return this._posts;
    }

    set posts(value: Array<string>) {
        this._posts = value;
    }

    get images(): Array<string> {
        return this._images;
    }

    set images(value: Array<string>) {
        this._images = value;
    }
    constructor(webId: string, name: string, role: string, gender: string, country: string, locality: string, postalCode: string, job: string, address: string, organization: string, imageProfile: string, friends: Array<string>, posts: Array<string>, images: Array<string>) {
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
    private _webId:string;
    private _name:string;
    private _role:string;
    private _gender:string;
    private _country:string;
    private _locality:string;
    private _postalCode:string;
    private _job:string;
    private _address:string;
    private _organization:string;
    private _imageProfile:string;
    private _friends:Array<string> = [];
    private _posts:Array<string> = [];
    private _images:Array<string> = [];
}