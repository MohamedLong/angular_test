import { Component, Input, OnInit } from '@angular/core';
import { Category } from '../../../model/category';
import { Part } from '../../../model/part';
import { SubCategory } from '../../../model/subcategory';
import { CategoryService } from '../../../service/category.service';
import { PartService } from '../../../service/part.service';
import { RequestService } from '../../../service/request.service';
import { SubCategoryService } from '../../../service/subcategory.service';

@Component({
    selector: 'app-new-part',
    templateUrl: './new-part.component.html',
    styles: ['']
})
export class NewPartComponent implements OnInit {

    constructor(private partService: PartService, private subCategoryService: SubCategoryService, private requestService: RequestService, private categoryService: CategoryService) { }

    parts: Part[] = [];
    categories: Category[] = [];
    subCategories: SubCategory[] = [];
    selectedPart: Part;
    selectedCategory: Category;
    selectedSubCategory: SubCategory;
    subCategoryId: number;
    categoryId: number;
    isFetching: boolean = false;
    checked: boolean;
    disableList: boolean = false;
    part: Part;
    partName: string;
    actionName: string;
    updatedPart: any
    @Input() type: string = 'new part';
    @Input() partDetails: Part = {};
    @Input() errMsg: string = "";
    @Input() category: Category;
    @Input() subcategory: SubCategory;
    @Input() actions: any[] = [];
    isAlreadyExists: boolean = false;

    ngOnInit(): void {
        //console.log(this.actions)
        if (this.type == 'claim') {
            this.categories.push(this.category);
            this.subCategories.push(this.subcategory);
            this.selectedCategory = this.category;
            this.selectedSubCategory = this.subcategory;

            this.disableList = true;
        } else {
            //console.log(this.category, this.subcategory)
            this.getPartCategories();
        }
    }

    getPartCategories() {
        this.categoryService.getAll().subscribe(res => {
            this.categories = res;
            if (this.partDetails) {
                this.showPart(this.partDetails);
            }
        });
    }

    showPart(part: Part) {
        // console.log('inside showPart: ', part);
        this.selectedCategory = this.categories.find(c => c.id == part.categoryId);
        this.subCategoryService.getSubCategoriesByCategory(part.categoryId).subscribe(res => {
            this.subCategories = res;
            //this.selectedSubCategory is not showen yet, still under fixing..

            // this.selectedSubCategory = this.subCategories.find(c => c.id = part.subCategoryId);
            this.onSubCategoryChange(part.subCategoryId);
            this.selectedPart = this.parts.find(s => s.id == part.id);
            this.part = part;
            this.requestService.part.next(this.part)
            this.disableList = this.type == 'edit req' ? false : true;
        });
    }

    onSearchPart(event: any) {
        this.isFetching = true;
        this.partService.getPartByPartName(event.query).subscribe(res => {
            if (res.length > 0) {
                this.parts = res;
                this.isFetching = false;
            } else {
                if (this.type == 'claim') {
                    console.log('this is a new part');
                    this.disableList = true;
                    this.updatedPart = {
                        name: this.partName,
                        status: 0
                    };
                } else {
                    this.disableList = false;
                    this.selectedPart = null;
                    this.isFetching = false;

                }
            }
        }, err => {
            this.disableList = false;
            this.selectedPart = null;
            this.isFetching = false;
        })

    }

    onClearSearchPart() {
        this.disableList = false;
        this.isFetching = false;
    }

    onChoosePart(part: Part) {
        if (this.type == 'claim') {
            console.log(part)
            if (part.categoryId == this.category.id) {
                console.log('this part already exists');
                this.isAlreadyExists = true;
                this.updatedPart = part;
            } else {
                console.log('this part doesnt exists on this category');
                this.updatedPart = part;
            }
        } else {
            this.selectedPart = part;
            this.selectedCategory = this.categories.find(c => c.id == this.selectedPart.categoryId);
            this.subCategoryService.getSubCategoriesByCategory(this.selectedPart.categoryId).subscribe(res => {
                this.subCategories = res;
                this.selectedSubCategory = this.subCategories.find(c => c.id = this.selectedPart.subCategoryId);
                this.disableList = true;
                this.part = this.selectedPart;
                this.part.subCategoryId = this.selectedSubCategory.id;
                this.requestService.part.next(this.part)
            })
        }
    }

    onSelectPart() {
        this.part = this.selectedPart;
        this.part.subCategoryId = this.selectedSubCategory.id;

        this.requestService.part.next(this.part)
    }

    onCategoryChange(id: number) {
        this.subCategoryService.getSubCategoriesByCategory(id).subscribe(res => {
            this.subCategories = res;
        })

    }

    onSubCategoryChange(id: number) {
        let selectedSubCat = this.subCategories.find(s => s.id == id);

        this.subCategoryId = selectedSubCat.id;
        this.parts = selectedSubCat.parts;
    }

    createNewPart() {
        if (this.checked == true && !this.selectedPart) {
            this.part.id = null;
            this.part.name = this.partName;
            this.part.status = 0;
            this.part.subCategoryId = this.selectedSubCategory.id;
        } else if (this.checked == false && this.selectedPart) {
            this.part = this.selectedPart;
        } else {
            this.part = {};
        }

        this.requestService.part.next(this.part);
    }

    onAction($event) {
        //console.log($event)
        this.requestService.part.next({ part: this.updatedPart, option: $event, exists: this.isAlreadyExists });
    }
}
