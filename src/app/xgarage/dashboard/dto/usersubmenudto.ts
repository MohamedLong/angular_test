
import { SubMenu } from '../model/submenu';

export interface UserSubMenuDto{
    pageId?: number;
    subMenu?: SubMenu;
    newAuth?: boolean;
    editAuth?: boolean;
    deleteAuth?: boolean;
    printAuth?: boolean;
    approveAuth?: boolean;
    cancelAuth?: boolean;
    acceptAuth?: boolean;
    completeAuth?: boolean;

}