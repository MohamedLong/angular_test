import { UserSubMenu } from './usersubmenu';
import { MainMenu } from './mainmenu';
import { Role } from '../../common/model/role';
export interface UserMainMenu {
    id?: number;
    role?: Role;
    mainMenu?: MainMenu;
    subMenus?: UserSubMenu[];
}
