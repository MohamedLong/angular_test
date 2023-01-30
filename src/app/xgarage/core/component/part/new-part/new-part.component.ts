import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Part } from '../../../model/parts';
import { PartService } from '../../../service/part.service';
import { RequestService } from '../../../service/request.service';

@Component({
    selector: 'app-new-part',
    templateUrl: './new-part.component.html',
    styles: ['']
})
export class NewPartComponent implements OnInit {

    constructor(private partService: PartService, private requestService: RequestService) { }

    parts: Part[];
    categories: any[];
    subCategories: any[];
    selectedPart: Part;
    selectedCategory: any;
    selectedSubCategory: any;
    subCategoryId: number;
    categoryId: number;
    isFetching: boolean = false;
    checked: boolean;
    disableList: boolean = false;
    part: Part;
    partName: string;

    @Input() type: string = 'new part';
    @Input() errMsg: string = "";

    ngOnInit(): void {
        this.getPartCategory();
    }

    onSearchPart(event: any) {
        this.isFetching = true;

        this.partService.getPartByPartName(event.query).subscribe(res => {
            this.parts = res;
            this.isFetching = false;
        }, err => {
            console.log(err);
            this.disableList = false;
            this.selectedPart = null;
            this.isFetching = false;
        })
    }

    onChoosePart(part: Part) {
        this.selectedPart = part;
        this.selectedCategory = this.categories.find(c => c.id == this.selectedPart.categoryId);
        this.onCategoryChange(this.selectedPart.categoryId);
        this.selectedSubCategory = this.subCategories.find(c => c.id = this.selectedPart.subCategoryId);
        this.disableList = true;
        this.part = this.selectedPart;
        this.part.subCategoryId = this.selectedSubCategory.id;

        this.requestService.part.next(this.part)
    }

    onSelectPart(part: Part) {
        this.part = this.selectedPart;
        this.part.subCategoryId = this.selectedSubCategory.id;

        this.requestService.part.next(this.part)
    }

    getPartCategory() {
        this.partService.getAll().subscribe(res => {
            this.categories = res;
        })
    }

    onCategoryChange(id: number) {
        //console.log(id)
        let selectedCategory = this.categories.filter(category => {
            return category.id == id;
        })

        this.subCategories = selectedCategory[0].subCategories;
        //console.log(this.subCategories)
    }

    onSubCategoryChange(id: number) {
        //console.log(id)
        let selectedSubCategory = this.subCategories.filter(subcategory => {
            return subcategory.id == id;
        })

        this.subCategoryId = selectedSubCategory[0].id;
        this.parts = selectedSubCategory[0].parts;
    }

    createNewPart() {
        if(this.checked == true && !this.selectedPart) {
            this.part.id = null;
            this.part.name = this.partName;
            this.part.status = 0;
            this.part.subCategoryId = this.selectedSubCategory.id;
        }else if(this.checked == false && this.selectedPart){
            this.part = this.selectedPart;
        }else{
            this.part = {};
        }

        this.requestService.part.next(this.part);
    }
}
