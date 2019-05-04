let usersAndRolesController = require('../../controllers/usersControllers/usersAndRolesController');
let UsersPermissionsController = require('../../controllers/usersControllers/UsersPermissionsController');
let processStructureController = require('../../controllers/processesControllers/processStructureController');
let waitingProcessStructuresController = require('../../controllers/processesControllers/waitingProcessStructuresController');
let activeProcessController = require('../../controllers/processesControllers/activeProcessController');
let processReportController = require('../../controllers/processesControllers/processReportController');
let notificationController = require('../../controllers/notificationsControllers/notificationController');
let onlineFormsController = require('../../controllers/onlineFormsControllers/onlineFormController');
let filledOnlineFormsController = require('../../controllers/onlineFormsControllers/filledOnlineFormController');
let UserPermissions = require('../../domainObjects/UserPermissions');
let mongoose = require('mongoose');
let mocha = require('mocha');
let describe = mocha.describe;
let it = mocha.it;
let assert = require('chai').assert;
let fs = require("fs");

let formFields1_innerRequestOrderFromSupplier = [
    {
        "field": "date",
        "value": "U2FsdGVkX18u5ZdUvSyAeVLcDPdmAJf/QOkpxxFCZjA="
    },
    {
        "field": "purpose",
        "value": "U2FsdGVkX195MZHVlMGIofZam5Q30zXzEBrt0VlPVABEkmnTjiQxSlhYoNoJDVRS"
    },
    {
        "field": "price",
        "value": "U2FsdGVkX1+NgADAAQJoMCHu5Ue69jRcWsdlHzC8L5c="
    },
    {
        "field": "payment_condition",
        "value": "U2FsdGVkX1+s40xAVVs/8SRJE0aNoeJXftEVs4QT688S2oE2ULFUZSoxGG2T30LuCzZq1C24dL2g8bs+YaHN8Q=="
    },
    {
        "field": "recommended",
        "value": "U2FsdGVkX19zmFkU7aVDlnOnCXjKCvMENnBzLT5r0ek="
    },
    {
        "field": "cause1",
        "value": "U2FsdGVkX1+sH/Rk++E/dIJgGbwU7DiiSvqrTHTdjPA="
    },
    {
        "field": "chosen",
        "value": "U2FsdGVkX18+8jrS1dWaIUsG2hDlWKQgTi6vuqLPYkI="
    },
    {
        "field": "cause2",
        "value": "U2FsdGVkX1/D7VRRb5gE8wPRNPSOsFjHfnc/TPZYroc="
    },
    {
        "field": "date2",
        "value": "U2FsdGVkX1+BDuZahsZY0I+GEEtmB2+ql5Rlq7PR3uQ="
    },
    {
        "field": "2date",
        "value": "U2FsdGVkX18/nwhwRIZV++Wx8GSY3Tti9KP0SDqnWmk="
    },
    {
        "field": "order_num",
        "value": "U2FsdGVkX1+cCYPOdvJlXDOvfDDhyGmReJ2HlJKeZSY="
    },
    {
        "field": "suggestion_num",
        "value": "U2FsdGVkX197DZ8jmfn7KBt2nfCJkDCEfxjTX7AH8bk="
    },
    {
        "field": "to",
        "value": "U2FsdGVkX1+6lDSwUFP+5uhOJxHf4k4vvLSlsz05t/A="
    },
    {
        "field": "company_name",
        "value": "U2FsdGVkX186IQmh8GjpNPlgqlNuTiZWw03fr2tw4Kk="
    },
    {
        "field": "num",
        "value": "U2FsdGVkX1/ZyeYnf3BSrV0tFLjsAaUDt8Z45RbkZvQ="
    },
    {
        "field": "address",
        "value": "U2FsdGVkX18gNfUNiqovq2nGab1lQO3u2GGQJuf9ndk="
    },
    {
        "field": "phone",
        "value": "U2FsdGVkX19yK02xOx7Dh/ug0lrPRVXI+rwFhKOhRiI="
    },
    {
        "field": "fax",
        "value": "U2FsdGVkX1+1WEX4HvJnIaEw72xQXvONL2Vv99hQHko="
    },
    {
        "field": "order_date",
        "value": "U2FsdGVkX1+/hbAodhy3rqBpYzm6Tdhgq5nHRBiFUWk="
    },
    {
        "field": "supply_date",
        "value": "U2FsdGVkX19nEpdd7MHl+46rE5rN1WYeubCRn7nkMxo="
    },
    {
        "field": "sum",
        "value": "U2FsdGVkX18kHi9f2H8OIcCEtxEZXXvQ82YeENFZEGA="
    },
    {
        "field": "price2",
        "value": "U2FsdGVkX1/LN9huqma1co64AY+FVq0zAqPirbJkuV0="
    },
    {
        "field": "name1",
        "value": "U2FsdGVkX1//KoE8xHENIh4f9JcIFcBVU8u056oX9a0="
    },
    {
        "field": "date_1",
        "value": "U2FsdGVkX1/I4d/njscdBEwnzbLZTwYnckcPCWXWuaI="
    },
    {
        "field": "nam2",
        "value": "U2FsdGVkX1/zynFrJRbwsJj7jRmIRFk+HgHVosVxcOc="
    },
    {
        "field": "date_2",
        "value": "U2FsdGVkX192jKlAGrsMkr5xu1DrTwTscHWdufPvpW8="
    },
    {
        "field": "name3",
        "value": "U2FsdGVkX18VYn7ywqkJmsHJZIc/cm5/mPzw/MlK6mM="
    },
    {
        "field": "v",
        "value": "U2FsdGVkX18qV8P7G3401LkHutrYZzW47xOvsFThpF4="
    },
    {
        "field": "signature_1",
        "value": "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"
    },
    {
        "field": "signature_2",
        "value": "U2FsdGVkX1+qGoprlfiuN+IqQXBaY3pukiU5+fTH/mZGr+jhiaMJBqImZkmFkRsfwv09Jbm4CMsUNHT9gDM3sW9RKyo+pfLDtQqTmfs1TladaqqqmR1LAP6AlZlnYZgo0TUnER0GYpV9RaHF28SIP3dBuRXU0VnIWosLlfLajg9I4KJlFhETkpKFudCUMJ9vT96YYIwNUxtdLVIvQM1PWJJuV/dUYQA40+2m1sXAr1hXqzcySFhdRXIrRtwblibZvI2l64C2Elm1AxRHyJ0/q8NVv/KaKABs7XeM/Q233ElXAO8bD+JyvLHa6LzblF1hxbHyEehybZOIA38yR+ulO+kQGAE8I6yA9BU67A7p0R4/Rh6p1JwLpjz5tTeqtlEpZVE7OgR9kEVGp180GXRU58GcgZ5bQk0MSPi2mDVfVyvcAbUSFyQldgezn8KQWDvyiOkQpsPJ4ercGMk8wTVatcjYYo1gqYbu8EcljZybtQbvSO0h9RdZ/4Uv4kPDT+SAcCTuzW8KHgxudoDGqO04wdrbWWKCbpu9W+MUbH+EVvRg65ktKsvUWXPS9Ik0krkQ17P+1XXlVwCcqZQOcS+zOkLjIHR5SUdgD1knEtPlzZMu1kSt5OTwtcqmxVBXT2VSoYWFgFiBs6VbwPTj6jMpNhn8jA1g+uowuW7U8O4mc2xm68QBakZaTuxfDQLMOWi86cQrUb4RJZIhE1PgLojF+fMEKwDXp+PyZRlkr1K7cyJIhyRDhyTVMAjGOHeoiC5hCNmsaekT6K8MzY3tUk/Pc2f87mGHfwpz6xxBMHz/BuFXUpOV4FawRwb1YJWoIwJ8iqbgxaD3F4wg5eOxQZVbo1FmdGgPbmflg10IjDmUA9BNJuzXDC/KWRpR/rIwE8UkRfK5BsHoIm1pMQtkO159kCrhxmYbtM/MwNuRL1XtEyPcPkfSJf3HZYuCkstUVaJmsjyxl6MSNguCvyEcOsLbrUzmDRbeaWQQLaPPJjMDiwIXuUNR/H863ANrM/k8ZMnEUL8x/Byad8Os3wJAg3GXKjgxiHA0jTTob9gGdNBFcJXFMIoVHLLQsg91fnmjh23vXtkYLW6jrAIYiCvK9MMLXfPkIqRtzbRFUl194RQ4lxLPSfawDn8lZmIy7u3Gx3UuxJgWjWSu3Vfly+SXycIw10Red7oUs+ggv/mMzCvz7b/jcp3BeD2RMig4lDFO9VEtOahArRZGZcByxF4McMKyG60i6FuhI1/myAzgSVqRcOXgrHpXTEe5U7lmlGIxDBJM6mXa0hpp1N5DKGA+9tZar7qjILWcsCUR4Smiw6Fi8k0vXJK0XGFSgU9wBheQtkL1fXjQ3gvgv2Dq+XQ8Dveo0vwSt3wvzcsq/adoL0w1pKcJ6vXkNAY2CC5e8qWSm1fwl3eZa6FfRcYxIAogVJobTsWsIHax5EBbuLT3tiq+9P6FEy2B43tPov+FR0x81mrSPJ0nm3rm+fdQ1Rmn7YwH8Ivs8t2F9EoD7Sk/VZcKVjU6QIUdsHvUjMny9sZWc6VDnc3sepHQ3uJHvgw07tDyChI+t8CDKOYkstLubjSICpkTmCwBo7fXUeAQigNgMePYKPhOb362I6Sqm2xCuZfdUqR0a/R23cymNrlpSMPiGEOQWq3cp/eL+l4eaJuXZjQcx2Jey3PFsLl4nafKEqvG9o1mAphuls/S5aFHB4X+fb7Vc56VsVjDOK/Skc9nJfwN48bS/Z9kVwaabUgHE2OVe7P3s0rxph6hdbPqM07vJp8+jORctKjPxmYQrnmEuc34HPM3aO/cuQ+otIw7AQhv4vBEq00I8GmjYuu1UwQWJblLnP5ldp6ADhlVCl45s2M/ewqcutGlkTRRUhlUSo4Epr9A+M7ZQv+lFH5lVegvnjnFZJ6swI/hcOrdawCk6iNrlCRV+8RdSk4y/pHpZ/DjecgGmwoLDRP/xfY1K9dsuZXvX4eqI256rr+Rrn66di2oWMKfNgpKriBD89ULVuYppUPgKI1PghP7GwnVY+mHvp9RXjd3h1Ie6GPOaG2NG2bBMbpNsxyeHhOU4L0oZ1smQMuiifUkHVgdTC+GPqJCf3NbzMYIBngjcOf15e0BZRJJ7fuyfeG6lTEBmPmxNldc3Deq+FqMLg/lJn33jR+ORmzTvQFFl2dOiOpKV5vYUy3l0XcD8+CxuIDrUoP4cOzzg5rH7dhLXwR12/3WsDVxXhjZ3EhOfxUsq80NwC9q6imqHR7VWLEldIFF/iuExsF/M517kXNiB1O5Dzr53qKKSCE2VgvPbqXID6DLJUo+O5pB8pumH1J/ymuixhCIFyiUKG1dwVAwGcdcxvZzIrmVZzi5q6O7TqzigY1yf5zk9Tm60NI8cxxwk1Ux9g5CvYDvQRl+OOwWGb1DqbVDP49z2T/fhSRfy4cSJJ69B5Es9TwxLwylqOj1j6F4E3DlomUL+BaW0xDowNkfZiSquHjCDiPJN8MFt7BhhLpjJuk9tUTXCQUNZ5ue8hleMo3RB2h/t9ZfQaO6Drfi+9WwYWZDVCMi9dsPW49bKC2E+PLvs/ljMYR5Lx/SAvKnUAhTwHKHk8xQP3CdcRVuwJoeZxfaePMwH6Nya+6fg/9tIkI7DEnN1DOS0tMyc890E6ua0G1g678MXar+FlWeOKJeMtOUZEQQRU1OrjJ6BP0tORZY6Ri5ndKVYoQSTJ8Ap3wDJdW2glP8OUy2jOvO0afHNeF57wF6/jdnvtMVPKw/msvnRvn8dWdk3S8eXZ5WpXzdkw5rtmNNsl2YKFmz83F6j1AfbcvBj1j8+u4C+gYSQpSMscltfeKzP9miwXX3kWCuFqRuzfWJZHKTljWkxAQEU4HxqjrNxQ6j3maxnyGGvqnyGZikMFvW4N4DrzwCKcCujM3TszoZHTTSXJA8V0g5lD7bWp0RFLQ1XEevE4QsvvisHN2Li0GDsLVLWFlhLpUUqq0XjYKSy9JBf0/u944gUviOP2P2I+XD2d7OuS4Iu0DWTNcGk6kmvEMF/HPLG1FhcDd7DObLCKrthdxD+W5XAzFVh2W8MLFMB7gHNDKjLK32xEn3xoeO71LkIZhFRQd6vK60fIkvib2fPwzQkQP0Cmerc9ODNFIEh0ZbD9aMhdeAa5L0xc5iRf2MAoo+oSlp3obpsY4M+nwrzUEQN3xNkVajvU6gaXOhZR+TOxL+xVEH4htrbk09MvwEUPPQ2TrgF/vFIA=="
    },
    {
        "field": "signature_3",
        "value": ""
    },
    {
        "field": "signature_4",
        "value": ""
    },
    {
        "field": "signature_5",
        "value": ""
    },
    {
        "field": "__table_prices",
        "value": "U2FsdGVkX1/PH59DPsXJ1a6gsNPaaNqqhveJJyusfwuzIc4uEmG6W+XenKvlk0NfzsJ/dkVzJpHM3URG4yofmWOVlwg7hwt80PIFdKraPipxTGU7q5ImMx3LneqSfTvfu3Wdi1ot13LmPzEbDMs/oHMz5SzHE1zvPRZjQVKpYvHB6tNwMUplABkPkF91jFWjfNwKXoaQ5CPBPP5ZmswRFS3G9vEgsB4FKDlz6XIAkbdBmxfr5KV1vhK87vlx6ZWRVaemqrVKkCW1mW3y0sxK4zENFSPHrMN4b3fj59lpTSnRN0L24fOiMnl6mXxKc45MZZms3EFT41IEb5TISyon9yf31zdlt9vDXSvzEJeSm86iA+WIu9addWi+kxD7vlz7XttfxcMGhYSmZ5Zwxgo6BzgdpGRcjhXrEGlJFOlZmfSCwhA4W162s4V/59Xxwe+pv0mHw0x2SHJXDo0GxdeBCheoEG1mxifsJDcLkWPJ7AFje0NDAOfMluZ73KMbXktnOg+OFqdcTplrbDaLkXOHDauCUKBMPM2rggscDFOwXPE9gmU29P+CmyAbXSDSSSlrw9LkaPr4W9IGl5ItLs+2IJjwkuWsrl4w6LDTkRgv4qV3l6gc9EbMPPfBoWt+nMoKpw70nqzznzmM2XBjqJr2FGVYsrWxt8K2kNerJdqUECYK98rpOoU/amMy0M/ePDT103PtuMDpU9/CY1uvwPVELVlvjkkzDTpU1M6tfNosx2scn/UXa+Z1Bf625JXy5dUb"
    },
    {
        "field": "__table_orders_table",
        "value": "U2FsdGVkX1/jXyAl76SkZMxldaJpzwSkyY2scoK2VLpPXZNbV3x+UmyYANB8VeNHKswFWU8OyvQzvmLOwSefYunOB39Y9Y5ylRYPlGbSeUilUwQS4Ffr6Be1zU5mwwgu6e9ryHhhjxLt0MTdPe6DvuNwZPNQo6IQtQ9sc8cqzLBEsFyHtteZ0R1maGIOf49/S9ic53eGNH6km4XaeLbI+UDSnx5ZkwdmCFrhSbgf9lrhS5Ze8/z0nCvyjDI0brKuSDL8ALTg+J8GetyecjklZ5zhgPFYaaRDUJxMNfaffqe5CCx+PRlGp1mJOzju1i5mN7M0evTo9ow9ul92QCKJQaHiuNPonV1bjXQoO7eLcu/F7pHG/GRk2EWnANsFMAd4JJ1a/BFHDFnb55qzWKi1wzsAE1wlj53LLucNDd1TSCLRbdUOkOC8WP9Uxy7/TtMiI027H7Bc5UnGT+bqZt/50lKjX6Hb/R5129IVvlAdHD5pv3TUJQaLa4hoEzXPVBcNwAGguoHxIfr5bsS+b+GfQrPs6LkdUg9qnTI6ipYjnWxm9dQYW/XFKIOLzajtb6cAOmvGidIctftoh2Ov1SKKN9TYANF6n5utKjtgWxCKnV27pVImurC6/Mlu5Dn1RQj4IcpNre84cPwd6UG4GDGCw69av2+UxTiezxAZW89F6NhvbaA7bYhJDqyKk7E7OKUk"
    }
];

let globalBefore = async function () {
    mongoose.set('useCreateIndex', true);
    await mongoose.connect('mongodb://localhost:27017/Tests', {useNewUrlParser: true});
    mongoose.connection.db.dropDatabase();
};

let globalAfter = function () {
    mongoose.connection.close();
};

let createUsersAndRolesTree = function (callback) {
    let tree9_string = fs.readFileSync("./test/inputs/trees/tree9/tree9.json");
    usersAndRolesController.getUsersAndRolesTree(() => {
        usersAndRolesController.setUsersAndRolesTree("creator@email.com", tree9_string,
            {
                "יו\"ר": ["yor@outlook.com"],
                "סיו\"ר": ["sayor@outlook.com"],
                "רמ\"ד כספים": ["cesef@outlook.com"],
                "רמ\"ד אקדמיה": ["academy@outlook.com"],
                "רמ\"ד הסברה": ["hasbara@outlook.com"],
                "רמ\"ד מעורבות": ["meoravut@outlook.com"],
                "מנהל/ת רווחה": ["revaha@outlook.com"],
                "מנהלת גרפיקה": ["graphics@outlook.com"],
                "רכז ניו מדיה": ["new_media@outlook.com", "new_media2@outlook.com", "new_media3@outlook.com"],
                "מנהל/ת אתר אינטרנט": ["website@outlook.com"],
                "מנהל/ת מיזמים אקדמים": ["meizamim@outlook.com"]
            },
            {
                "yor@outlook.com": "אלף בית",
                "sayor@outlook.com": "בית גימל",
                "cesef@outlook.com": "גימל דלת",
                "academy@outlook.com": "דלת היי",
                "hasbara@outlook.com": "היי וו",
                "meoravut@outlook.com": "וו זין",
                "revaha@outlook.com": "זין חית",
                "graphics@outlook.com": "חית טת",
                "meizamim@outlook.com": "טת יוד",
                "new_media@outlook.com": "יוד כף",
                "new_media2@outlook.com": "יוד כף למד",
                "new_media3@outlook.com": "כף למד מם",
                "website@outlook.com": "כף למד"
            },
            {
                "יו\"ר": "5",
                "סיו\"ר": "4",
                "רמ\"ד כספים": "3",
                "רמ\"ד אקדמיה": "3",
                "רמ\"ד הסברה": "3",
                "רמ\"ד מעורבות": "3",
                "מנהל/ת רווחה": "2",
                "מנהלת גרפיקה": "2",
                "רכז ניו מדיה": "1",
                "מנהל/ת אתר אינטרנט": "2",
                "מנהל/ת מיזמים אקדמים": "2"
            },
            (err) => {
                if (err) {
                    callback(err);
                } else {
                    UsersPermissionsController.setUserPermissions(new UserPermissions("yor@outlook.com", [true, true, true, true]), (err) => {
                        if (err) {
                            callback(err);
                        } else {
                            onlineFormsController.createAllOnlineForms(() => {
                                callback()
                            });

                        }
                    });
                }


            }
        );
    });
};

describe.skip('online form in processes test', function () {

    before(globalBefore);
    after(globalAfter);
    let processStructure9_string = fs.readFileSync("./test/inputs/processStructures/processStructure9/processStructure9.json");

    let firstFormID = null;

    it('1.1 creates users and process structure with forms', function (done) {
        createUsersAndRolesTree((err) => {
            if (err) done(err);

            onlineFormsController.getAllOnlineForms((err, onlineFormsObjects) => {
                if (err) done(err);
                firstFormID = onlineFormsObjects[0].formID;
                processStructureController.addProcessStructure("sayor@outlook.com", "מעורבות באתר אקדמיה", processStructure9_string,
                    [firstFormID], "24", 20, (err, needApprove) => {
                        assert.deepEqual(needApprove, "approval");
                        waitingProcessStructuresController.getAllWaitingProcessStructuresWithoutSankey((err, waitingStructures) => {
                            if (err) {
                                done(err);
                            } else {
                                assert.deepEqual(waitingStructures[0].userEmail, "sayor@outlook.com");
                                assert.deepEqual(waitingStructures[0].onlineForms, [firstFormID]);
                                waitingProcessStructuresController.approveProcessStructure("yor@outlook.com", waitingStructures[0].id, (err) => {
                                    if (err) {
                                        done(err);
                                    } else {
                                        processStructureController.getAllProcessStructures((err, processStructures) => {
                                            if (err) {
                                                done(err);
                                            } else {
                                                assert.deepEqual(processStructures[0].onlineForms, [firstFormID]);
                                                done();
                                            }
                                        });
                                    }
                                });
                            }
                        });
                    });
            });
        });
    }).timeout(30000);

    it('1.2 Starting filling form.', function (done) {
        activeProcessController.startProcessByUsername("website@outlook.com", "מעורבות באתר אקדמיה", "תהליך 1",
            new Date(2022, 4, 26, 16), 2, (err) => {
                if (err) {
                    done(err);
                } else {
                    filledOnlineFormsController.updateOrAddFilledForm("מעורבות באתר אקדמיה", "טופס דרישה פנימית והזמנת רכש לספק", formFields1_innerRequestOrderFromSupplier, (err) => {
                        if (err) done(err);
                        filledOnlineFormsController.getFilledOnlineFormByID(firstFormID, (err, res) => {
                            if (err) done(err);
                            assert.deepEqual(res.formID, firstFormID);
                            assert.deepEqual(res.formObject.formName, "טופס דרישה פנימית והזמנת רכש לספק");
                            assert.deepEqual(res.formObject.fields, "טופס דרישה פנימית והזמנת רכש לספק");

                        })
                    });
                }
            });
    }).timeout(30000);

    it.skip('1.3 Checking reports and notifications', function (done) {
        processReportController.getAllProcessesReportsByUser("yor@outlook.com", (err, processReports) => {
            if (err) {
                done(err);
            } else {
                notificationController.getUserNotifications("website@outlook.com", (err, websiteNotifications) => {
                    if (err) {
                        done(err);
                    } else {
                        notificationController.getUserNotifications("sayor@outlook.com", (err, sayorNotifications) => {
                            if (err) {
                                done(err);
                            } else {
                                assert.deepEqual(true, sayorNotifications.some(notification => {
                                    return notification.notificationType === "תהליך נגמר בהצלחה";
                                }));
                                assert.deepEqual(true, websiteNotifications.some(notification => {
                                    return notification.notificationType === "תהליך נגמר בהצלחה";
                                }));
                                assert.deepEqual(true, websiteNotifications.some(notification => {
                                    return notification.notificationType === "תהליך בוטל";
                                }));
                                assert.deepEqual(true, websiteNotifications.some(notification => {
                                    return notification.notificationType === "תהליך בהמתנה";
                                }));
                                assert.deepEqual(true, processReports.some(processReport => {
                                    return processReport.processName === "תהליך 1";
                                }));
                                done();
                            }
                        });
                    }
                });
            }
        });
    }).timeout(30000);
});
