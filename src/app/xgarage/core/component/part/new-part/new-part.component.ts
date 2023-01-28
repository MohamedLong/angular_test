import { Component, Input, OnInit } from '@angular/core';
import { Part } from '../../../model/parts';
import { PartService } from '../../../service/part.service';

@Component({
    selector: 'app-new-part',
    templateUrl: './new-part.component.html',
    styles: ['']
})
export class NewPartComponent implements OnInit {

    constructor(private partService: PartService) { }

    parts: Part[];
    categories: any[];
    subCategories: any[];
    partNames: any[];
    selectedPart: Part;
    subCategoryId: number;
    isFetching: boolean = false;
    checked: boolean;

    @Input() type: string = 'new part';

    ngOnInit(): void {
        this.gerPartCategory()
    }

    onSerachPart(event: any) {
        this.isFetching = true;

        this.partService.getPartByPartName(event.query).subscribe(res => {
            this.parts = res;
            this.isFetching = false;
        }, err => {
            console.log(err)
            this.isFetching = false;
        })
    }

    onSelectPart(part: Part) {
        this.selectedPart = part;
    }

    gerPartCategory() {
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
        console.log(this.subCategories)
    }

    onSubCategoryChange(id: number) {
        //console.log(id)
        let selectedSubCategory = this.subCategories.filter(subcategory => {
            return subcategory.id == id;
        })

        this.subCategoryId = selectedSubCategory[0].id;
        this.partNames = selectedSubCategory[0].parts;
    }
}
