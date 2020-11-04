import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ListsComponent } from './lists/lists.component';
import { MemberDetailComponent } from './members/member-detail/member-detail.component';
import { MemberEditComponent } from './members/member-edit/member-edit.component';
import { MemberListComponent } from './members/member-list/member-list.component';
import { MessagesComponent } from './messages/messages.component';
import { AuthGuard } from './_guards/auth.guard';
import { PreventUnsavedChanges } from './_guards/prevent-unsaved-changes.guard';
import { ListResolver } from './_resolver/lists.resolver';
import { MemberDetailResolver } from './_resolver/member-detail.resolver';
import { MemberEditResolver } from './_resolver/member-edit.resolver';
import { MemberListResolver } from './_resolver/member-list.resolver';

export const appRoutes: Routes = [
    { path: '', component: HomeComponent },
    // we can use canActivate for different paths and there is no issue in that
    // but we have used the below method to see the different options how can use AuthGuard
    {
        path: '',
        runGuardsAndResolvers: 'always',
        canActivate: [AuthGuard],
        children: [
            { path: 'members', component: MemberListComponent, resolve: {users: MemberListResolver}  },
            { path: 'members/:id', component: MemberDetailComponent, resolve: {user: MemberDetailResolver} },
            { path: 'member/edit', component: MemberEditComponent,
                resolve: {user: MemberEditResolver}, canDeactivate: [PreventUnsavedChanges] },
            { path: 'lists', component: ListsComponent, resolve: {users: ListResolver} },
            { path: 'messages', component: MessagesComponent }
        ]
    },
    // { path: 'members', component: MemberListComponent, canActivate: [AuthGuard] },
    // { path: 'lists', component: ListsComponent },
    // { path: 'messages', component: MessagesComponent },
    { path: '**', redirectTo: '', pathMatch: 'full' }
];
