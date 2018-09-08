import { Component } from '@angular/core';
import {
  NgbModal,
  ModalDismissReasons,
  NgbActiveModal
} from '@ng-bootstrap/ng-bootstrap';
import { AuthenticationService, LoginPayload } from '../../services/authentication.service';
import { ToastrService } from 'ngx-toastr';
@Component({
  templateUrl: 'ads.component.html',
  styles: ['p:hover, h1:hover, h2:hover, h3:hover, h4:hover, h5:hover { color: #383838 !important}']
})
export class AdsComponent {
  closeResult: string;
  imageSrc: any = '';
  image = '';
  idAds = null;
  ads1 = '';
  ads2 = '';
  ads3 = '';
  ads4 = '';
  adsid1 = '';
  adsid2 = '';
  adsid3 = '';
  adsid4 = '';
  constructor(private modalService: NgbModal, private toastr: ToastrService,
    private auth: AuthenticationService) {
      this.ads();
  }
  openPostModal(content, id) {
    this.idAds = id;
    this.modalService.open(content).result.then(
      result => {
        this.closeResult = `Closed with: ${result}`;
      },
      reason => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      }
    );
  }
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  handleFileInputforPost(files: FileList) {
    const reader = new FileReader();
    reader.onload = e => this.imageSrc = reader.result;

    reader.readAsDataURL(files.item(0));
    this.auth.postFile(files.item(0))
      .then(res => {
        this.image = res.path;
        if (this.idAds === 1) {
          if (this.ads1) {
            this.editAds(this.idAds, res.path, this.adsid1);
            this.ads1 = res.path;
          } else {
            this.uploadAds(res.path, this.idAds);
            this.ads1 = res.path;
          }
        }
        if (this.idAds === 2) {
          if (this.ads2) {
            this.editAds(this.idAds, res.path, this.adsid2);
            this.ads2 = res.path;
          } else {
            this.ads2 = res.path;
            this.uploadAds(res.path, this.idAds);
          }
        }
        if (this.idAds === 3) {
          if (this.ads3) {
            this.editAds(this.idAds, res.path, this.adsid3);
            this.ads3 = res.path;
          } else {
            this.uploadAds(res.path, this.idAds);
            this.ads3 = res.path;
          }
        }
        if (this.idAds === 4) {
          if (this.ads4) {
            this.editAds(this.idAds, res.path, this.adsid4);
            this.ads4 = res.path;
          } else {
            this.uploadAds(res.path, this.idAds);
            this.ads4 = res.path;
          }
        }
      },
        error => console.error(error)
      );
  }

  uploadAds(path, id) {
    this.auth.adsFile(path, id)
      .then(
        res => {
          this.imageSrc = null;
          document.getElementById('closeCreatePostModal').click();
          this.toastr.success('Ad has been added!');
        },
        error => this.toastr.error('An error happened! Please try again.'));
  }

  editAds(adsID, path, id) {
    this.auth.editAds(adsID, path, id)
    .then(
      res => {
        this.imageSrc = null;
        document.getElementById('closeCreatePostModal').click();
        this.toastr.success('Ad has been updated!');

      },
      error => this.toastr.error('An error happened! Please try again.'));
  }

  ads() {
    this.auth.getAds()
      .then(
        res => {
        for (let i = 0; i < res.adsMap.length; i++) {
        if (res.adsMap[i].id === '1') {
          this.ads1 = res.adsMap[i].path;
          this.adsid1 = res.adsMap[i]._id;
        }
        if (res.adsMap[i].id === '2') {
          this.ads2 = res.adsMap[i].path;
          this.adsid2 = res.adsMap[i]._id;
        }
        if (res.adsMap[i].id === '3') {
          this.ads3 = res.adsMap[i].path;
          this.adsid3 = res.adsMap[i]._id;
        }
        if (res.adsMap[i].id === '4') {
          this.ads4 = res.adsMap[i].path;
          this.adsid4 = res.adsMap[i]._id;
        }
        }
        },
        error => console.log(error));
  }
}
